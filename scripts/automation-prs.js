#!/usr/bin/env node
'use strict';

// This program is always loaded from the trusted default branch. Pull requests
// supply bounded text through the GitHub API, never scripts or build artifacts.
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { SHA, classifyPullRequest, validateNewProfile, actionUpdates, assertUnchanged } = require('./automation-policy.js');

const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : {};
const branch = event.repository?.default_branch;
const prefix = `/repos/${repo}`;

async function api(endpoint, options = {}) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    method: options.method || 'GET',
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`GitHub API request failed (${response.status}); retry or inspect repository policy.`);
  return response.json();
}

function output(key, value) {
  const text = String(value);
  if (/[\r\n]/.test(text)) throw new Error('Workflow outputs must occupy one line.');
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${text}\n`);
  else console.log(`${key}=${text}`);
}

function summary(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n\n`);
}

async function filesFor(pr) {
  if (!Number.isInteger(pr.changed_files) || pr.changed_files > 10) return [];
  const files = await api(`${prefix}/pulls/${pr.number}/files?per_page=100`);
  if (!Array.isArray(files) || files.length !== pr.changed_files) throw new Error('Incomplete pull request file list.');
  return files;
}

async function treeAt(sha) {
  if (!SHA.test(sha)) throw new Error('Invalid commit identifier.');
  const commit = await api(`${prefix}/git/commits/${sha}`);
  const tree = await api(`${prefix}/git/trees/${commit.tree.sha}?recursive=1`);
  if (tree.truncated || !Array.isArray(tree.tree)) throw new Error('Cannot validate an incomplete Git tree.');
  return new Map(tree.tree.map(entry => [entry.path, entry]));
}

async function textAt(tree, filename, maxBytes) {
  const entry = tree.get(filename);
  if (!entry || entry.type !== 'blob' || entry.mode !== '100644' || entry.size > maxBytes)
    throw new Error('Automatic merges accept only small, ordinary text files (no symlinks or executable files).');
  const blob = await api(`${prefix}/git/blobs/${entry.sha}`);
  if (blob.encoding !== 'base64' || blob.size > maxBytes) throw new Error('Unsupported file encoding or size.');
  const bytes = Buffer.from(blob.content, 'base64');
  if (bytes.length !== blob.size || bytes.length > maxBytes) throw new Error('Incomplete file content.');
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

async function passedChecks(pr, request = api) {
  const runs = await request(`${prefix}/actions/workflows/build.yml/runs?event=pull_request&head_sha=${pr.head.sha}&per_page=20`);
  const latest = runs.workflow_runs.find(run => run.head_sha === pr.head.sha && run.head_repository?.full_name === pr.head.repo?.full_name);
  if (!latest || latest.status !== 'completed' || latest.conclusion !== 'success') return false;
  // A successful workflow can contain only skipped jobs. Require the actual
  // build job from this run to succeed before considering other checks.
  const jobs = await request(`${prefix}/actions/runs/${latest.id}/jobs?filter=latest&per_page=100`);
  if (jobs.total_count > jobs.jobs.length || !jobs.jobs.some(job =>
      job.name === 'Test and build' && job.status === 'completed' && job.conclusion === 'success')) return false;
  const checks = await request(`${prefix}/commits/${pr.head.sha}/check-runs?filter=latest&per_page=100`);
  if (checks.total_count > checks.check_runs.length || checks.check_runs.some(check =>
      check.status !== 'completed' || !['success', 'neutral', 'skipped'].includes(check.conclusion))) return false;
  const statuses = await request(`${prefix}/commits/${pr.head.sha}/status?per_page=100`);
  if (statuses.total_count > 0 && statuses.state !== 'success') return false;
  const reviews = await request(`${prefix}/pulls/${pr.number}/reviews?per_page=100`);
  if (reviews.length === 100) return false; // Fail closed rather than miss later requested changes.
  const lastReview = new Map();
  for (const review of reviews) {
    if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) lastReview.set(review.user.id, review.state);
  }
  return ![...lastReview.values()].includes('CHANGES_REQUESTED');
}

async function discover() {
  let candidates;
  if (event.workflow_run) {
    if (event.workflow_run.event !== 'pull_request' || event.workflow_run.conclusion !== 'success' || !SHA.test(event.workflow_run.head_sha)) {
      output('pulls', '[]'); return;
    }
    candidates = await api(`${prefix}/commits/${event.workflow_run.head_sha}/pulls?per_page=100`);
    candidates = candidates.filter(pr => pr.head.sha === event.workflow_run.head_sha);
  } else if (process.env.REQUESTED_PR) {
    if (!/^\d+$/.test(process.env.REQUESTED_PR)) throw new Error('Provide a numeric pull request number.');
    candidates = [await api(`${prefix}/pulls/${process.env.REQUESTED_PR}`)];
  } else {
    // A bounded reconciliation pass recovers temporary API failures/base races.
    // Older PRs can be selected explicitly using workflow_dispatch.
    candidates = await api(`${prefix}/pulls?state=open&sort=updated&direction=desc&per_page=50`);
  }
  const numbers = [...new Set(candidates.filter(pr => pr.state === 'open' && !pr.draft && pr.base.ref === branch).map(pr => pr.number))];
  output('pulls', JSON.stringify(numbers));
}

async function validate() {
  const number = process.env.PR_NUMBER;
  if (!/^\d+$/.test(number || '')) throw new Error('Invalid pull request number.');
  output('eligible', 'false');
  const pr = await api(`${prefix}/pulls/${number}`);
  const files = await filesFor(pr);
  const kind = classifyPullRequest(pr, files, branch);
  if (!kind) { summary(`PR #${number} requires maintainer review; it is outside the automatic merge policy.`); return; }
  if (!await passedChecks(pr)) { summary(`PR #${number} is waiting for successful checks or review resolution.`); return; }
  const base = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (pr.base.sha !== base) throw new Error('The base branch moved during checkout. The daily retry will revalidate.');
  const headTree = await treeAt(pr.head.sha);
  for (const file of files) {
    if (headTree.get(file.filename)?.sha !== file.sha) throw new Error('Pull request content changed during validation.');
  }
  if (kind === 'profile') {
    const file = files[0];
    const raw = await textAt(headTree, file.filename, 2048);
    validateNewProfile(file.filename, raw, pr.user.login);
    // wx prevents overwriting an existing local file or following a symlink.
    fs.writeFileSync(file.filename, raw, { flag: 'wx' });
    const buildEnv = { ...process.env };
    for (const key of Object.keys(buildEnv)) if (/TOKEN|SECRET|PASSWORD|CREDENTIAL/.test(key)) delete buildEnv[key];
    execFileSync(process.execPath, ['build.js'], { env: buildEnv, stdio: 'inherit', timeout: 120000 });
  } else {
    const baseTree = await treeAt(base);
    for (const file of files) {
      const before = await textAt(baseTree, file.filename, 100000);
      const after = await textAt(headTree, file.filename, 100000);
      for (const update of actionUpdates(before, after)) {
        const release = await api(`/repos/${update.repository}/commits/${update.version}`);
        if (release.sha !== update.sha) throw new Error('Action pin does not match the official version tag.');
      }
    }
  }
  const current = await api(`${prefix}/pulls/${number}`);
  assertUnchanged(current, { head: pr.head.sha, base, branch });
  output('head', pr.head.sha);
  output('base', base);
  output('eligible', 'true');
  summary(`PR #${number}: ${kind === 'profile' ? 'author-owned profile' : 'official Actions patch/minor update'} validated against the current base and exact head commit.`);
}

async function merge() {
  const number = process.env.PR_NUMBER;
  const head = process.env.EXPECTED_HEAD;
  const base = process.env.EXPECTED_BASE;
  if (!/^\d+$/.test(number || '') || !SHA.test(head || '') || !SHA.test(base || '')) throw new Error('Missing validated pull request identifiers.');
  const pr = await api(`${prefix}/pulls/${number}`);
  assertUnchanged(pr, { head, base, branch });
  if (!classifyPullRequest(pr, await filesFor(pr), branch) || !await passedChecks(pr)) throw new Error('Pull request eligibility changed.');
  // GitHub atomically rejects a different head SHA and enforces branch rules.
  const result = await api(`${prefix}/pulls/${number}/merge`, { method: 'PUT', body: {
    sha: head, merge_method: 'squash', commit_title: `${pr.title.replace(/[\r\n]/g, ' ').slice(0, 180)} (#${number})`, commit_message: '',
  } });
  if (!result.merged || !SHA.test(result.sha)) throw new Error('GitHub declined the automatic merge; inspect repository rules.');
  output('merged', 'true');
  summary(`Squash-merged PR #${number}. Deployment follows in this workflow because GITHUB_TOKEN merges do not trigger push workflows.`);
}

async function main() {
  if (!/^[A-Za-z\d_.-]+\/[A-Za-z\d_.-]+$/.test(repo || '') || !token || !branch) throw new Error('Run this script inside its GitHub Actions workflow.');
  const commands = { discover, validate, merge };
  if (!Object.hasOwn(commands, process.argv[2])) throw new Error('Use discover, validate or merge.');
  await commands[process.argv[2]]();
}

if (require.main === module) {
  main().catch(error => { summary(error.message); process.exitCode = 1; });
}

module.exports = { passedChecks };
