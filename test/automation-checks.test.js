'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { passedChecks } = require('../scripts/automation-prs.js');

const sha = 'a'.repeat(40);
const pr = { number: 42, head: { sha, repo: { full_name: 'contributor/GitStart' } } };

function fixtures() {
  return {
    runs: { workflow_runs: [{ id: 123, head_sha: sha, head_repository: { full_name: 'contributor/GitStart' }, status: 'completed', conclusion: 'success' }] },
    jobs: { total_count: 1, jobs: [{ name: 'Test and build', status: 'completed', conclusion: 'success' }] },
    checks: { total_count: 1, check_runs: [{ status: 'completed', conclusion: 'success' }] },
    statuses: { total_count: 0, state: 'pending' },
    reviews: [],
  };
}

function requestFor(data) {
  return async endpoint => {
    if (endpoint.includes('/actions/workflows/build.yml/runs?')) return data.runs;
    if (endpoint.includes('/actions/runs/123/jobs?')) return data.jobs;
    if (endpoint.includes('/check-runs?')) return data.checks;
    if (endpoint.includes('/status?')) return data.statuses;
    if (endpoint.includes('/reviews?')) return data.reviews;
    throw new Error(`Unexpected API request: ${endpoint}`);
  };
}

test('accepts successful current-head CI, including a repository with no legacy statuses', async () => {
  assert.equal(await passedChecks(pr, requestFor(fixtures())), true);
});

test('workflow success alone, a different head or fork, and stale successful runs cannot authorize a merge', async () => {
  for (const mutate of [
    data => { data.runs.workflow_runs[0].head_sha = 'b'.repeat(40); },
    data => { data.runs.workflow_runs[0].head_repository.full_name = 'someone-else/GitStart'; },
    data => { data.runs.workflow_runs.unshift({ ...data.runs.workflow_runs[0], status: 'in_progress', conclusion: null }); },
    data => { data.jobs.jobs[0].conclusion = 'skipped'; },
    data => { data.jobs.jobs[0].name = 'Unrelated job'; },
    data => { data.jobs.total_count = 101; },
  ]) {
    const data = fixtures();
    mutate(data);
    assert.equal(await passedChecks(pr, requestFor(data)), false);
  }
});

test('pending, failed, or truncated additional checks and failing statuses block automatic merging', async () => {
  for (const mutate of [
    data => { data.checks.check_runs[0].status = 'queued'; },
    data => { data.checks.check_runs[0].conclusion = 'failure'; },
    data => { data.checks.total_count = 101; },
    data => { data.statuses = { total_count: 1, state: 'failure' }; },
    data => { data.statuses = { total_count: 1, state: 'pending' }; },
  ]) {
    const data = fixtures();
    mutate(data);
    assert.equal(await passedChecks(pr, requestFor(data)), false);
  }
});

test('requested changes block merges until that reviewer approves or the review is dismissed', async () => {
  const data = fixtures();
  data.reviews = [{ user: { id: 10 }, state: 'CHANGES_REQUESTED' }, { user: { id: 20 }, state: 'APPROVED' }];
  assert.equal(await passedChecks(pr, requestFor(data)), false);
  data.reviews.push({ user: { id: 10 }, state: 'COMMENTED' });
  assert.equal(await passedChecks(pr, requestFor(data)), false);
  data.reviews.push({ user: { id: 10 }, state: 'APPROVED' });
  assert.equal(await passedChecks(pr, requestFor(data)), true);
  data.reviews.at(-1).state = 'DISMISSED';
  assert.equal(await passedChecks(pr, requestFor(data)), true);
  data.reviews = Array.from({ length: 100 }, () => ({ user: { id: 20 }, state: 'APPROVED' }));
  assert.equal(await passedChecks(pr, requestFor(data)), false);
});

test('API authorization failures cannot become successful check results', async () => {
  await assert.rejects(passedChecks(pr, async () => { throw new Error('HTTP 403'); }), /HTTP 403/);
});

test('fork PR discovery falls back to its exact source branch when GitHub omits commit associations', async () => {
  const { candidatesForRun } = require('../scripts/automation-prs.js');
  const sha = 'a'.repeat(40);
  const run = {event:'pull_request',conclusion:'success',head_sha:sha,head_repository:{full_name:'octocat/GitStart'},head_branch:'add-me'};
  const matching = {number:1,head:{sha,repo:{full_name:'octocat/GitStart'}}};
  const calls = [];
  const found = await candidatesForRun(run, async endpoint => {
    calls.push(endpoint);
    return calls.length === 1 ? [] : [matching,{number:2,head:{sha:'b'.repeat(40),repo:{full_name:'octocat/GitStart'}}}];
  });
  assert.deepEqual(found,[matching]);
  assert.ok(calls[1].includes('head=octocat%3Aadd-me'));
  assert.deepEqual(await candidatesForRun({...run,conclusion:'failure'},()=>{throw new Error('must not query');}),[]);
});
