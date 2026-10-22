'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { assertNoReviewObjections, validateManifest } = require('../scripts/merge-backlog.js');

test('legacy batch merges respect current review objections and fail closed on truncation', () => {
  const review = state => ({user:{id:1},state});
  assert.throws(() => assertNoReviewObjections([review('CHANGES_REQUESTED')]), /outstanding/);
  assert.doesNotThrow(() => assertNoReviewObjections([review('CHANGES_REQUESTED'), review('APPROVED')]));
  assert.throws(() => assertNoReviewObjections(Array(100).fill(review('APPROVED'))), /incomplete/);
});

test('legacy merge manifests cannot include duplicate accounts or unsafe paths', () => {
  const candidate = {number:1, head_sha:'a'.repeat(40), sha256:'b'.repeat(64),author:'octocat',username:'octocat',path:'src/profiles/octocat.md'};
  const manifest = candidates => ({schema:1,repository:'rishabh-bansal/GitStart',candidates});
  assert.doesNotThrow(() => validateManifest(manifest([candidate])));
  assert.throws(() => validateManifest(manifest([candidate,{...candidate,number:2}])), /Duplicate username/);
  assert.throws(() => validateManifest(manifest([{...candidate,path:'src/profiles/../../build.js'}])), /Unsafe/);
});
