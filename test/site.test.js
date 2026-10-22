'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { once } = require('node:events');
const { build, parseProfile, esc, fill } = require('../build.js');
const { site, pages } = require('../src/content.js');
const { createServer } = require('../server.js');
const out = path.join(__dirname, '..', 'public');
const base = new URL(site.url).pathname.replace(/\/$/, '');
build();

function html(file) { return fs.readFileSync(path.join(out, file), 'utf8'); }

test('profiles reject malformed input without losing historical filename compatibility', () => {
  const raw = '---\r\nusername: octocat\r\nfullname: Octo Cat\r\n---\r\n';
  assert.equal(parseProfile('legacy_name.md', raw, false).username, 'octocat');
  assert.throws(() => parseProfile('legacy_name.md', raw, true), /filename/);
  assert.throws(() => parseProfile('octocat.md', raw.replace('Octo Cat', 'a'.repeat(121)), true), /120/);
  assert.throws(() => parseProfile('octocat.md', raw.replace('fullname:', 'username: evil\r\nfullname:'), true), /duplicate/);
  assert.throws(() => parseProfile('x.md', raw.replace('octocat', 'a--b'), true), /valid GitHub username/);
});

test('user text is escaped and unknown template slots fail the build', () => {
  assert.equal(esc('<img onerror="x">&\''), '&lt;img onerror=&quot;x&quot;&gt;&amp;&#39;');
  assert.throws(() => fill('{{MISSING}}', {}), /Unknown template token/);
});

test('published pages have matching canonicals, metadata, valid JSON-LD, and no unresolved slots', () => {
  for (const page of Object.values(pages)) {
    const body = html(path.join(page.dir, 'index.html'));
    const canonical = `${site.url}/${page.dir ? `${page.dir}/` : ''}`;
    assert.equal((body.match(/<h1\b/g) || []).length, 1);
    assert.ok(body.includes(`<link rel="canonical" href="${canonical}"`));
    assert.ok(body.includes('name="description"'));
    assert.ok(body.includes('property="og:image"'));
    assert.ok(body.includes('name="twitter:card"'));
    assert.doesNotMatch(body, /\{\{[A-Z_]+\}\}/);
    for (const match of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.equal(JSON.parse(match[1])['@context'], 'https://schema.org');
    }
  }
});

test('every local HTML link, image fallback and fragment resolves under the deployment base', () => {
  for (const file of ['index.html', 'submissions/index.html', 'cheatsheet/index.html', '404.html']) {
    const body = html(file);
    for (const [, attribute, value] of body.matchAll(/\b(href|src|data-fallback)="([^"]+)"/g)) {
      if (value.startsWith('#')) {
        assert.ok(body.includes(`id="${value.slice(1)}"`), `Missing fragment ${value} in ${file}`);
      } else if (value.startsWith('/')) {
        assert.ok(value.startsWith(`${base}/`), `Missing base: ${attribute}=${value}`);
        const local = value.slice(base.length + 1).split('#')[0];
        const target = path.join(out, local.endsWith('/') || local === '' ? `${local}index.html` : local);
        assert.ok(fs.existsSync(target), `Missing local asset ${target}`);
      }
    }
  }
  const manifest = JSON.parse(html('site.webmanifest'));
  assert.ok(manifest.name);
  for (const icon of manifest.icons) {
    assert.ok(!icon.src.startsWith('/'));
    assert.ok(fs.existsSync(path.join(out, icon.src)));
  }
});

test('sitemap omits the error page and avoids invented freshness dates', () => {
  const sitemap = html('sitemap.xml');
  assert.equal((sitemap.match(/<loc>/g) || []).length, Object.keys(pages).length);
  assert.doesNotMatch(sitemap, /404|lastmod|changefreq|priority/);
  assert.match(html('404.html'), /name="robots" content="noindex"/);
  assert.ok(html('robots.txt').includes(`${site.url}/sitemap.xml`));
});

test('build is deterministic for unchanged source', () => {
  const before = ['index.html', 'submissions/index.html', 'sitemap.xml'].map(html);
  build();
  assert.deepEqual(['index.html', 'submissions/index.html', 'sitemap.xml'].map(html), before);
});

test('preview serves base paths, redirects directories, and handles errors and traversal safely', async (t) => {
  const server = createServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const request = (pathname, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: server.address().port, path: pathname, method }, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
    });
    req.on('error', reject); req.end();
  });
  assert.equal((await request(`${base}/`)).status, 200);
  assert.equal((await request(`${base}/site.js`)).headers['content-type'], 'text/javascript; charset=utf-8');
  assert.equal((await request(`${base}/submissions`)).status, 301);
  assert.equal((await request(`${base}/missing`)).status, 404);
  assert.equal((await request(`${base}/%ZZ`)).status, 400);
  assert.equal((await request(`${base}/%2e%2e/package.json`)).status, 403);
  assert.equal((await request(`${base}/.git/config`)).status, 403);
  assert.equal((await request(`${base}/`, 'POST')).status, 405);
  assert.equal((await request(`${base}/`, 'HEAD')).body, '');
  assert.equal((await request(`${base}/`)).status, 200, 'bad requests must not crash the server');
});
