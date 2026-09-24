#!/usr/bin/env node
'use strict';

// Maintainer tool: merge a reviewed manifest of legacy profile additions.
// Dry run by default. No code from a contributor branch is ever executed.
// Usage: node scripts/merge-backlog.js --manifest /path/to/safe-profile-prs.json
// Add --execute only after the reviewed site changes are on the default branch.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { parseProfile } = require('../build.js');
const root = path.resolve(__dirname, '..');
const repository = 'rishabh-bansal/GitStart';
const runtimePaths = ['build.js', 'src/content.js', 'src/styles.css', 'src/site.js', 'src/templates', 'static'];

function command(program, args, options = {}) {
  const result = spawnSync(program, args, {
    cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 32 * 1024 * 1024, ...options,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${program} failed: ${result.error?.message || result.stderr || result.stdout}`);
  }
  return result.stdout;
}
function api(endpoint, extra = []) {
  return JSON.parse(command('gh', ['api', endpoint, ...extra]));
}
function git(...args) { return command('git', args).trim(); }
function sha256(data) { return crypto.createHash('sha256').update(data).digest('hex'); }
function ensureCommit(sha) {
  const found = spawnSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: root });
  if (found.status !== 0) git('fetch', '--no-tags', 'origin', sha);
}
function assert(ok, message) { if (!ok) throw new Error(message); }
function readTrustedRuntime() {
  const files = new Map();
  function visit(relative) {
    const source = path.join(root, relative);
    const stat = fs.lstatSync(source);
    assert(!stat.isSymbolicLink(), `Trusted runtime must not contain links: ${relative}.`);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(source)) visit(`${relative}/${name}`);
    } else {
      assert(stat.isFile(), `Unexpected trusted runtime entry: ${relative}.`);
      files.set(relative, fs.readFileSync(source));
    }
  }
  for (const source of runtimePaths) visit(source);
  return files;
}
function assertPublishedRuntime(base, runtime) {
  const entries = git('ls-tree', '-rz', base, '--', ...runtimePaths).split('\0').filter(Boolean);
  assert(entries.length === runtime.size, 'Trusted runtime differs from the target branch; publish the reviewed rebuild first.');
  for (const entry of entries) {
    const match = /^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)$/.exec(entry);
    assert(match && runtime.has(match[3]), 'Target runtime contains unexpected files or links.');
    const bytes = command('git', ['cat-file', 'blob', match[2]], { encoding: null });
    assert(bytes.equals(runtime.get(match[3])), `Trusted runtime differs from the target branch: ${match[3]}. Publish the reviewed rebuild first.`);
  }
}
function validateManifest(manifest) {
  assert(manifest.schema === 1 && manifest.repository === repository && Array.isArray(manifest.candidates), 'Invalid review manifest.');
  const numbers = new Set();
  const usernames = new Set();
  const filenames = new Set();
  for (const candidate of manifest.candidates) {
    assert(Number.isSafeInteger(candidate.number) && candidate.number > 0, 'Invalid PR number.');
    assert(/^[a-f0-9]{40}$/.test(candidate.head_sha), `Invalid head SHA for #${candidate.number}.`);
    assert(/^[a-f0-9]{64}$/.test(candidate.sha256), `Invalid content hash for #${candidate.number}.`);
    assert(typeof candidate.author === 'string' && typeof candidate.username === 'string', `Missing identity for #${candidate.number}.`);
    assert(/^src\/profiles\/[A-Za-z0-9][A-Za-z0-9._-]{0,63}\.md$/.test(candidate.path), `Unsafe profile path for #${candidate.number}.`);
    assert(!numbers.has(candidate.number), `Duplicate PR #${candidate.number} in manifest.`);
    assert(!usernames.has(candidate.username.toLowerCase()), `Duplicate username in manifest: ${candidate.username}.`);
    assert(!filenames.has(candidate.path.toLowerCase()), `Duplicate profile path in manifest: ${candidate.path}.`);
    numbers.add(candidate.number);
    usernames.add(candidate.username.toLowerCase());
    filenames.add(candidate.path.toLowerCase());
  }
}
function checkRegularProfile(tree, filename) {
  const entry = git('ls-tree', tree, '--', filename);
  assert(/^(100644|100755) blob [a-f0-9]{40}\t/.test(entry), 'Profile must be a regular Markdown file.');
}

function verifyCandidate(candidate) {
  const number = candidate.number;
  assert(Number.isSafeInteger(number) && number > 0, 'Invalid PR number.');
  const pr = api(`repos/${repository}/pulls/${number}`);
  if (pr.merged) return { alreadyMerged: true };
  assert(pr.state === 'open' && !pr.draft, 'PR is closed or a draft.');
  assert(pr.base.repo.full_name === repository && pr.base.ref === 'master', 'Unexpected target branch.');
  assert(pr.head.sha === candidate.head_sha, 'PR head changed since review; review it again.');
  assert(pr.changed_files === 1, 'PR no longer changes exactly one file.');
  assert(pr.user.login.toLowerCase() === candidate.author.toLowerCase(), 'PR author changed since review.');
  const runtime = readTrustedRuntime();
  const files = api(`repos/${repository}/pulls/${number}/files?per_page=100`);
  assert(files.length === 1 && files[0].status === 'added', 'Only one added profile is supported.');
  const filename = files[0].filename;
  assert(filename === candidate.path, 'Changed file differs from review.');
  assert(/^src\/profiles\/[A-Za-z0-9][A-Za-z0-9._-]{0,63}\.md$/.test(filename), 'Unsafe profile filename.');
  ensureCommit(pr.head.sha);
  ensureCommit(pr.base.sha);
  checkRegularProfile(pr.head.sha, filename);
  const bytes = command('git', ['show', `${pr.head.sha}:${filename}`], { encoding: null });
  assert(bytes.length <= 8192 && sha256(bytes) === candidate.sha256, 'Profile bytes changed or exceed 8 KiB.');
  const raw = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  // Historical file names can differ from the handle. New PR automation is stricter.
  const profile = parseProfile(path.basename(filename), raw, false);
  assert(profile.username.toLowerCase() === pr.user.login.toLowerCase(), 'Profile identity differs from the PR author.');
  assert(profile.username.toLowerCase() === candidate.username.toLowerCase(), 'Profile identity differs from review.');

  // The current local runtime must be the reviewed runtime already published on
  // the remote base. This prevents accidentally validating with different code.
  // Compare bytes explicitly so untracked local runtime files cannot bypass the
  // publication requirement. Build from this same snapshot below.
  assertPublishedRuntime(pr.base.sha, runtime);
  const mergeOutput = git('merge-tree', '--write-tree', pr.base.sha, pr.head.sha);
  const tree = mergeOutput.split('\n')[0];
  assert(/^[a-f0-9]{40}$/.test(tree), 'Merge did not produce a valid tree.');
  const changes = git('diff', '--name-status', pr.base.sha, tree);
  assert(changes === `A\t${filename}`, 'Merged tree contains unexpected changes.');

  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'gitstart-backlog-'));
  try {
    // Copy only trusted local runtime code. Untrusted profile blobs remain data.
    for (const [source, bytes] of runtime) {
      fs.mkdirSync(path.dirname(path.join(temporary, source)), { recursive: true });
      fs.writeFileSync(path.join(temporary, source), bytes);
    }
    const entries = command('git', ['ls-tree', '-rz', tree, '--', 'src/profiles']).split('\0').filter(Boolean);
    const seen = new Set();
    fs.mkdirSync(path.join(temporary, 'src/profiles'), { recursive: true });
    for (const entry of entries) {
      const match = /^(100644|100755) blob ([a-f0-9]{40})\t(src\/profiles\/[^/\r\n]+\.md)$/.exec(entry);
      assert(match, 'The merged profile tree contains an unexpected file or link.');
      const [, , blob, relative] = match;
      const data = command('git', ['cat-file', 'blob', blob], { encoding: null });
      const current = parseProfile(path.basename(relative), new TextDecoder('utf-8', { fatal: true }).decode(data), false);
      assert(!seen.has(current.username.toLowerCase()), `Duplicate profile: ${current.username}.`);
      seen.add(current.username.toLowerCase());
      fs.writeFileSync(path.join(temporary, relative), data);
    }
    command(process.execPath, ['build.js', '--check'], { cwd: temporary });
    command(process.execPath, ['build.js'], { cwd: temporary });
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
  const fresh = api(`repos/${repository}/pulls/${number}`);
  assert(fresh.state === 'open' && !fresh.draft && !fresh.merged, 'PR state changed during validation.');
  assert(fresh.base.repo.full_name === repository && fresh.base.ref === 'master', 'PR target changed during validation.');
  assert(fresh.head.sha === pr.head.sha, 'PR head moved during validation.');
  assert(fresh.base.sha === pr.base.sha, 'Target branch moved during validation; retry against its new state.');
  return { head: pr.head.sha, base: pr.base.sha, tree };
}

async function main() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    assert(['--manifest', '--limit', '--report', '--execute'].includes(args[i]), `Unknown option: ${args[i]}.`);
    if (args[i] !== '--execute') {
      assert(args[i + 1] && !args[i + 1].startsWith('--'), `Missing value for ${args[i]}.`);
      i++;
    }
  }
  const value = flag => args[args.indexOf(flag) + 1];
  assert(args.includes('--manifest'), 'Provide --manifest /path/to/safe-profile-prs.json.');
  const manifest = JSON.parse(fs.readFileSync(value('--manifest'), 'utf8'));
  validateManifest(manifest);
  const execute = args.includes('--execute');
  const limit = args.includes('--limit') ? Number(value('--limit')) : manifest.candidates.length;
  assert(Number.isInteger(limit) && limit > 0, '--limit must be a positive integer.');
  const results = [];
  for (const candidate of manifest.candidates.slice(0, limit)) {
    try {
      const review = verifyCandidate(candidate);
      if (review.alreadyMerged) {
        results.push({ number: candidate.number, status: 'already-merged' });
        console.log(`#${candidate.number}: already merged`);
        continue;
      }
      if (execute) {
        const response = api(`repos/${repository}/pulls/${candidate.number}/merge`, [
          '--method', 'PUT', '-f', 'merge_method=squash', '-f', `sha=${review.head}`,
        ]);
        assert(response.merged, response.message || 'GitHub did not merge the PR.');
        results.push({ number: candidate.number, status: 'merged', head: review.head, base: review.base, tree: review.tree, commit: response.sha });
        console.log(`#${candidate.number}: merged ${response.sha}`);
        await new Promise(resolve => setTimeout(resolve, 4000));
      } else {
        results.push({ number: candidate.number, status: 'validated', head: review.head, base: review.base, tree: review.tree });
        console.log(`#${candidate.number}: validated ${review.head}`);
      }
    } catch (error) {
      results.push({ number: candidate.number, status: 'skipped', error: error.message });
      console.error(`#${candidate.number}: skipped — ${error.message}`);
      // Fail closed on a changed head, unexpected file, build failure, or rate limit.
      // Stop so the maintainer can inspect the exact failure before continuing.
      process.exitCode = 1;
      break;
    }
  }
  const report = JSON.stringify({ reviewed_at: new Date().toISOString(), execute, results }, null, 2);
  if (args.includes('--report')) fs.writeFileSync(value('--report'), `${report}\n`);
  console.log(report);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { verifyCandidate, validateManifest };
