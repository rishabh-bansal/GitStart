'use strict';

const USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const SHA = /^[a-f\d]{40}$/;
const PROFILE_PATH = /^src\/profiles\/([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\.md$/i;
const OFFICIAL_ACTIONS = new Set([
  'actions/checkout', 'actions/setup-node', 'actions/github-script',
  'actions/configure-pages', 'actions/upload-pages-artifact', 'actions/deploy-pages',
]);

function classifyPullRequest(pr, files, defaultBranch) {
  if (pr.state !== 'open' || pr.draft || pr.base.ref !== defaultBranch ||
      !SHA.test(pr.head.sha) || !SHA.test(pr.base.sha) ||
      files.length !== pr.changed_files || !files.length) return null;
  if (files.length === 1 && files[0].status === 'added') {
    const match = PROFILE_PATH.exec(files[0].filename);
    if (match && USERNAME.test(pr.user.login) &&
        match[1].toLowerCase() === pr.user.login.toLowerCase()) return 'profile';
  }
  if (pr.user.login === 'dependabot[bot]' && pr.user.id === 49699333 &&
      pr.head.repo?.full_name === pr.base.repo.full_name && files.length <= 10 &&
      files.every(file => file.status === 'modified' &&
        /^\.github\/workflows\/[a-z\d-]+\.ya?ml$/i.test(file.filename))) return 'actions';
  return null;
}

function validateNewProfile(filename, raw, author) {
  const match = PROFILE_PATH.exec(filename);
  if (!match || match[1].toLowerCase() !== author.toLowerCase())
    throw new Error('Add one src/profiles/YOUR-GITHUB-USERNAME.md file matching the pull request author.');
  if (Buffer.byteLength(raw, 'utf8') > 2048 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(raw))
    throw new Error('Profile must be at most 2 KiB and contain no control or direction override characters.');
  const content = /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n)?\s*$/.exec(raw);
  if (!content) throw new Error('Use a frontmatter block only, with username and fullname fields.');
  const fields = Object.create(null);
  for (const line of content[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const pair = /^(username|fullname):[ \t]*(.+)$/.exec(line);
    if (!pair || Object.hasOwn(fields, pair[1])) throw new Error('Use each of username and fullname exactly once, with no extra fields.');
    let value = pair[2].trim();
    if (/^["']/.test(value)) {
      if (value.at(-1) !== value[0] || value.length < 2) throw new Error('Close quoted values with the matching quote.');
      value = value.slice(1, -1).trim();
    }
    fields[pair[1]] = value;
  }
  if (!USERNAME.test(fields.username || '') || fields.username.toLowerCase() !== author.toLowerCase())
    throw new Error('The username must match the GitHub account opening the pull request.');
  if (!fields.fullname || [...fields.fullname].length > 100 || /[<>\r\n]/.test(fields.fullname))
    throw new Error('Provide a display name between 1 and 100 characters, without HTML.');
  return fields;
}

// Match complete lines. Anything besides an existing official action pin and
// its version comment changing is a source change requiring human review.
function actionUpdates(before, after) {
  const oldLines = before.split('\n');
  const newLines = after.split('\n');
  if (oldLines.length !== newLines.length) throw new Error('Action updates cannot add or remove workflow lines.');
  const pin = /^(\s*(?:-\s*)?uses:\s*)(actions\/[a-z-]+)@([a-f\d]{40})(\s+#\s*)v(\d+)\.(\d+)\.(\d+)(\s*)$/;
  const updates = [];
  for (let i = 0; i < oldLines.length; i++) {
    if (oldLines[i] === newLines[i]) continue;
    const oldPin = pin.exec(oldLines[i]);
    const newPin = pin.exec(newLines[i]);
    if (!oldPin || !newPin || !OFFICIAL_ACTIONS.has(oldPin[2]) ||
        [1, 2, 4, 5, 8].some(part => oldPin[part] !== newPin[part]))
      throw new Error('Only same-major, SHA-pinned official Actions updates can merge automatically.');
    const oldMinor = Number(oldPin[6]), oldPatch = Number(oldPin[7]);
    const newMinor = Number(newPin[6]), newPatch = Number(newPin[7]);
    if (newMinor < oldMinor || (newMinor === oldMinor && newPatch <= oldPatch) || oldPin[3] === newPin[3])
      throw new Error('Action versions must move forward with a different pinned commit.');
    updates.push({ repository: newPin[2], sha: newPin[3], version: `v${newPin[5]}.${newMinor}.${newPatch}` });
  }
  if (!updates.length) throw new Error('No supported action update was found.');
  return updates;
}

function assertUnchanged(pr, expected) {
  if (pr.state !== 'open' || pr.draft || pr.head.sha !== expected.head ||
      pr.base.sha !== expected.base || pr.base.ref !== expected.branch)
    throw new Error('The pull request or base branch changed after validation. Retry the check.');
  // Do not bypass branch protections, pending checks, conflicts or requested changes.
  if (pr.mergeable !== true || pr.mergeable_state !== 'clean')
    throw new Error('GitHub has not marked this pull request clean and mergeable.');
}

module.exports = { SHA, PROFILE_PATH, classifyPullRequest, validateNewProfile, actionUpdates, assertUnchanged };
