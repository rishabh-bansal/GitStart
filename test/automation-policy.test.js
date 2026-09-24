'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { classifyPullRequest, validateNewProfile, actionUpdates, assertUnchanged } = require('../scripts/automation-policy.js');

const head = 'a'.repeat(40), base = 'b'.repeat(40);
const profile = 'src/profiles/example-user.md';
const raw = '---\nusername: example-user\nfullname: Example User\n---\n';
const makePr = changes => ({ number: 1, state: 'open', draft: false, changed_files: 1,
  user: { login: 'example-user', id: 123 },
  head: { sha: head, repo: { full_name: 'example-user/GitStart' } },
  base: { sha: base, ref: 'master', repo: { full_name: 'rishabh-bansal/GitStart' } },
  ...changes });
const added = [{ filename: profile, status: 'added' }];

test('only a new single author-owned profile is eligible', () => {
  assert.equal(classifyPullRequest(makePr(), added, 'master'), 'profile');
  for (const changes of [{ draft: true }, { state: 'closed' }, { changed_files: 2 }, { user: { login: 'someone-else' } },
    { head: { sha: 'untrusted' } }, { base: { sha: base, ref: 'other' } }]) {
    assert.equal(classifyPullRequest(makePr(changes), added, 'master'), null);
  }
  for (const status of ['modified', 'removed', 'renamed', 'copied'])
    assert.equal(classifyPullRequest(makePr(), [{ filename: profile, status }], 'master'), null);
});

test('shell metacharacters, paths, newlines and output delimiters never become eligible filenames', () => {
  for (const filename of ['src/profiles/$(id).md', 'src/profiles/`id`.md', 'src/profiles/example-user.md\nEOF\neligible=true',
    'src/profiles/../example-user.md', 'src/profiles/nested/example-user.md', 'src/profiles/-option.md',
    'src/profiles/example-user.md/extra', '.github/workflows/attack.yml']) {
    assert.equal(classifyPullRequest(makePr(), [{ filename, status: 'added' }], 'master'), null);
    assert.throws(() => validateNewProfile(filename, raw, 'example-user'));
  }
});

test('strict profile parsing accepts Unicode names, matching case, quotes, BOM and CRLF', () => {
  assert.equal(validateNewProfile(profile, raw, 'Example-User').fullname, 'Example User');
  const unicode = '\uFEFF---\r\nusername: "Example-User"\r\nfullname: \'李小龍\'\r\n---\r\n';
  assert.equal(validateNewProfile(profile, unicode, 'example-user').fullname, '李小龍');
});

test('rejects spoofing, extra fields, duplicate keys, bodies, malformed quotes and oversized/control text', () => {
  for (const invalid of [raw.replace('username: example-user', 'username: someone-else'),
    raw.replace('fullname: Example User', 'fullname: Example User\nusername: example-user'),
    raw.replace('fullname: Example User', 'fullname: Example User\nadmin: true'), raw + '<script>alert(1)</script>',
    raw.replace('Example User', '<script>'), raw.replace('Example User', 'a'.repeat(101)),
    raw.replace('Example User', '\u202eevil'), raw.replace('Example User', 'one\u0000two'),
    raw.replace('Example User', '"broken'), raw.replace('Example User', '""'),
    raw + ' '.repeat(2048), raw.replace('fullname: Example User\n', '')]) {
    assert.throws(() => validateNewProfile(profile, invalid, 'example-user'), invalid.slice(0, 100));
  }
});

const actionPr = () => makePr({ user: { login: 'dependabot[bot]', id: 49699333 },
  head: { sha: head, repo: { full_name: 'rishabh-bansal/GitStart' } } });
const workflowFile = [{ filename: '.github/workflows/build.yml', status: 'modified' }];

test('dependency eligibility checks bot identity, same repository and workflow-only changes', () => {
  assert.equal(classifyPullRequest(actionPr(), workflowFile, 'master'), 'actions');
  const spoofed = actionPr(); spoofed.user.id = 123;
  assert.equal(classifyPullRequest(spoofed, workflowFile, 'master'), null);
  const forked = actionPr(); forked.head.repo.full_name = 'attacker/GitStart';
  assert.equal(classifyPullRequest(forked, workflowFile, 'master'), null);
  assert.equal(classifyPullRequest(actionPr(), [{ filename: 'build.js', status: 'modified' }], 'master'), null);
});

const pin = (version, sha = head, action = 'actions/checkout') => `      - uses: ${action}@${sha} # v${version}`;

test('only forward same-major official Action SHA/version substitutions are accepted', () => {
  assert.deepEqual(actionUpdates(pin('7.0.1'), pin('7.0.2', base)), [{ repository: 'actions/checkout', sha: base, version: 'v7.0.2' }]);
  assert.equal(actionUpdates(pin('7.0.1'), pin('7.2.0', base)).length, 1);
  for (const after of [pin('8.0.0', base), pin('7.0.0', base), pin('7.0.1', base), pin('7.0.2'),
    pin('7.0.2', base, 'actions/unknown'), pin('7.0.2', base).replace('      -', '    -'),
    pin('7.0.2', base) + '\n      - run: echo pwned', pin('7.0.2', base).replace(base, 'v7')]) {
    assert.throws(() => actionUpdates(pin('7.0.1'), after));
  }
  assert.throws(() => actionUpdates('permissions: read\n' + pin('7.0.1'), 'permissions: write\n' + pin('7.0.2', base)));
});

test('merge refuses changed head/base, draft, conflicts and blocked/pending states', () => {
  const pr = makePr({ mergeable: true, mergeable_state: 'clean' });
  const expected = { head, base, branch: 'master' };
  assert.doesNotThrow(() => assertUnchanged(pr, expected, base));
  assert.throws(() => assertUnchanged(pr, expected, 'c'.repeat(40)));
  assert.throws(() => assertUnchanged(pr, expected));
  assert.doesNotThrow(() => assertUnchanged({ ...pr, base: { ...pr.base, sha: 'd'.repeat(40) } }, expected, base), 'old PR base metadata must not replace the current branch ref');
  for (const changes of [{ head: { sha: 'c'.repeat(40) } }, { base: { sha: base, ref: 'other' } },
    { draft: true }, { state: 'closed' }, { mergeable: null }, { mergeable: false },
    ...['blocked', 'dirty', 'behind', 'unstable', 'unknown'].map(mergeable_state => ({ mergeable_state }))])
    assert.throws(() => assertUnchanged({ ...pr, ...changes }, expected, base));
});

test('workflow trust boundaries remain explicit and actions remain SHA-pinned', () => {
  const workflows = path.join(__dirname, '../.github/workflows');
  for (const filename of fs.readdirSync(workflows)) {
    const text = fs.readFileSync(path.join(workflows, filename), 'utf8');
    assert.doesNotMatch(text, /pull_request_target:/, filename);
    assert.doesNotMatch(text, /ref:\s*\$\{\{[^}]*\.head\./, filename);
    assert.doesNotMatch(text, /run:\s*[^\n]*\$\{\{/, filename);
    for (const match of text.matchAll(/^\s*(?:-\s*)?uses:\s*([^\s]+)/gm))
      assert.match(match[1], /^(?:\.\/\.github\/workflows\/[a-z-]+\.yml|actions\/[a-z-]+@[a-f\d]{40})$/, filename);
  }
  const merge = fs.readFileSync(path.join(workflows, 'merge-candidate.yml'), 'utf8');
  assert.match(merge, /EXPECTED_HEAD:\s*\$\{\{ needs\.validate\.outputs\.head \}\}/);
  assert.match(merge, /EXPECTED_BASE:\s*\$\{\{ needs\.validate\.outputs\.base \}\}/);
  assert.doesNotMatch(merge, /download-artifact|cache@/);
  // Unspecified token permissions are disabled. Both the reusable workflow
  // and its caller must allow the check/status API reads before any merge.
  assert.equal((merge.match(/^      checks: read$/gm) || []).length, 2);
  assert.equal((merge.match(/^      statuses: read$/gm) || []).length, 2);
  const maintain = fs.readFileSync(path.join(workflows, 'maintain-prs.yml'), 'utf8');
  assert.match(maintain, /^      checks: read$/m);
  assert.match(maintain, /^      statuses: read$/m);
  const deploy = fs.readFileSync(path.join(workflows, 'deploy.yml'), 'utf8');
  assert.match(deploy, /^      pages: read$/m);
});
