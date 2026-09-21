#!/usr/bin/env node
/**
 * GitStart static site generator.
 *
 * Reads src/profiles/*.md and writes a complete static site to public/.
 *
 * Deliberately has ZERO dependencies — only Node's own `fs` and `path`. The
 * previous version of this site was a 2017 Gatsby app with 1,582 packages and
 * 233 open security advisories; it survived nine years only because nobody
 * touched it. Nothing here needs updating, so nothing here can rot.
 *
 *   node build.js           build the site into public/
 *   node build.js --check   validate every profile and exit (used by CI)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { site, steps, cheatsheet, pages } = require('./src/content.js');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PROFILES = path.join(SRC, 'profiles');
const TEMPLATES = path.join(SRC, 'templates');
const OUT = path.join(ROOT, 'public');
const STATIC = path.join(ROOT, 'static');

// GitHub usernames: alphanumeric and single hyphens, 1-39 chars.
const GH_USERNAME = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const FRONTMATTER = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

// ---------------------------------------------------------------- utilities

/** Escape text for use in HTML element content or a double-quoted attribute. */
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape a string for embedding inside a <script type="application/ld+json"> block. */
function escJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

/** Replace {{TOKEN}} placeholders. Unknown tokens are left alone so they're visible. */
function fill(template, values) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
  );
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(relPath, contents) {
  const target = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
  return target;
}

// ----------------------------------------------------------------- profiles

/**
 * Parse one profile file. Returns { username, fullname } or throws with a
 * message written for the contributor who will read it in CI, not for us.
 */
function parseProfile(filename, raw, strict) {
  const text = raw.replace(/^\uFEFF/, '');
  const match = FRONTMATTER.exec(text);

  if (!match) {
    throw new Error(
      'the file must start with a frontmatter block. It needs to look exactly like this,\n' +
      '  including both lines of three hyphens:\n\n' +
      '    ---\n    username: your-github-username\n    fullname: Your Full Name\n    ---'
    );
  }

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const kv = /^([A-Za-z_][A-Za-z0-9_-]*)[ \t]*:[ \t]*(.*)$/.exec(line);
    if (!kv) {
      throw new Error(`this line in the frontmatter could not be read: "${line.trim()}"`);
    }
    fields[kv[1].toLowerCase()] = kv[2].trim().replace(/^["']|["']$/g, '').trim();
  }

  for (const key of ['username', 'fullname']) {
    if (!(key in fields)) {
      const found = Object.keys(fields).join(', ') || 'nothing';
      throw new Error(`the "${key}" line is missing. The file has: ${found}`);
    }
    if (!fields[key]) {
      throw new Error(`"${key}" has no value after the colon`);
    }
  }

  if (!GH_USERNAME.test(fields.username)) {
    throw new Error(
      `"${fields.username}" is not a valid GitHub username.\n` +
      '  This should be your GitHub handle (the name in your profile URL), not your real name.'
    );
  }

  // Only enforced on newly added files (see --strict, used by the PR check).
  // Dozens of profiles merged before 2020 are named differently from the
  // username inside them; they render perfectly well and are not worth
  // rewriting other people's history over.
  const expected = `${fields.username}.md`;
  if (strict && filename.toLowerCase() !== expected.toLowerCase()) {
    throw new Error(
      `the filename does not match the username inside it.\n` +
      `  Rename the file to "${expected}", or correct the username line.`
    );
  }

  return { username: fields.username, fullname: fields.fullname };
}

/** Load and validate every profile. Throws a combined report if any fail. */
function loadProfiles(options = {}) {
  const { strict = false, only = null } = options;
  const files = fs
    .readdirSync(PROFILES)
    .filter((f) => f.endsWith('.md'))
    .sort();

  const profiles = [];
  const problems = [];
  const seen = new Map();

  for (const file of files) {
    try {
      const applyStrict = strict && (!only || only.has(file));
      const profile = parseProfile(file, read(path.join(PROFILES, file)), applyStrict);
      const key = profile.username.toLowerCase();
      if (seen.has(key)) {
        problems.push(`${file}\n  @${profile.username} is already listed in ${seen.get(key)}`);
        continue;
      }
      seen.set(key, file);
      profiles.push(profile);
    } catch (error) {
      problems.push(`${file}\n  ${error.message}`);
    }
  }

  if (problems.length) {
    const heading = problems.length === 1 ? '1 profile needs fixing' : `${problems.length} profiles need fixing`;
    throw new Error(
      `${heading}:\n\n` +
      problems.map((p) => `  ${site.profileDir}/${p}`).join('\n\n') +
      `\n\nSee ${site.url} for the format.`
    );
  }

  // Alphabetical by display name, case-insensitively, stable on username.
  profiles.sort(
    (a, b) =>
      a.fullname.localeCompare(b.fullname, 'en', { sensitivity: 'base' }) ||
      a.username.localeCompare(b.username, 'en', { sensitivity: 'base' })
  );

  return profiles;
}

// ---------------------------------------------------------------- rendering

function renderSteps() {
  return steps
    .map((step, index) => {
      const tip = step.tip
        ? `\n        <p class="step-tip"><strong>Watch out:</strong> ${step.tip}</p>`
        : '';
      return `    <li class="step" id="${esc(step.id)}">
      <span class="step-num" aria-hidden="true">${index + 1}</span>
      <div class="step-body">
        <h3>${esc(step.title)}</h3>
        <p>${step.body}</p>
        <pre class="step-cmd"><code>${esc(step.cmd)}</code></pre>${tip}
      </div>
    </li>`;
    })
    .join('\n');
}

function renderPeople(profiles) {
  return profiles
    .map((p) => {
      const name = esc(p.fullname);
      const user = esc(p.username);
      return `    <li>
      <a class="person" href="https://github.com/${user}" rel="noopener">
        <img class="person-avatar" src="https://github.com/${user}.png?size=144" alt="${name} — GitHub avatar" width="72" height="72" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/avatar-fallback.svg'" />
        <span class="person-name">${name}</span>
        <span class="person-handle">@${user}</span>
      </a>
    </li>`;
    })
    .join('\n');
}

function renderCheatsheet() {
  return cheatsheet
    .map(
      ([cmd, does, when]) => `      <tr>
        <td><code>${esc(cmd)}</code></td>
        <td>${esc(does)}</td>
        <td>${esc(when)}</td>
      </tr>`
    )
    .join('\n');
}

// ---------------------------------------------------------------------- SEO

/**
 * The path portion of site.url, if any. A GitHub Pages *project* site is served
 * from /RepoName/, so every root-relative link has to carry that prefix or it
 * 404s. On a custom domain the prefix is empty and this does nothing.
 */
const BASE = new URL(site.url).pathname.replace(/\/+$/, '');

/** Prefix root-relative href/src attributes with the base path. */
function withBase(html) {
  if (!BASE) return html;
  return html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${BASE}/`);
}

function canonicalFor(dir) {
  return dir ? `${site.url}/${dir}/` : `${site.url}/`;
}

/**
 * Structured data. The tutorial gets HowTo (each step is a HowToStep, which is
 * what can earn a rich result for "how to make a pull request"); inner pages
 * get a BreadcrumbList.
 */
function structuredData(key, page, profiles) {
  const blocks = [];

  if (key === 'tutorial') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: page.title,
      description: page.description,
      totalTime: 'PT15M',
      url: canonicalFor(page.dir),
      supply: [{ '@type': 'HowToSupply', name: 'A free GitHub account' }],
      tool: [{ '@type': 'HowToTool', name: 'git' }],
      step: steps.map((step, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: step.title,
        url: `${canonicalFor(page.dir)}#${step.id}`,
        itemListElement: [
          {
            '@type': 'HowToDirection',
            text: step.body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
          },
        ],
      })),
    });
  } else {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Tutorial', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: page.title, item: canonicalFor(page.dir) },
      ],
    });
  }

  if (key === 'submissions') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page.title,
      description: page.description,
      url: canonicalFor(page.dir),
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: profiles.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
      },
    });
  }

  return blocks
    .map((b) => `<script type="application/ld+json">${escJson(b)}</script>`)
    .join('\n');
}

function headFor(key, page, profiles) {
  const canonical = canonicalFor(page.dir);
  const ogImage = `${site.url}/og-image.png`;
  return [
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${esc(page.metaTitle)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(page.metaTitle)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.metaTitle)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    structuredData(key, page, profiles),
  ].join('\n');
}

// -------------------------------------------------------------------- build

function renderPage(key, page, profiles, layout) {
  const body = read(path.join(TEMPLATES, `${page.template}.html`));
  const count = String(profiles.length);

  const main = fill(body, {
    STEPS: renderSteps(),
    PEOPLE: renderPeople(profiles),
    ROWS: renderCheatsheet(),
    COUNT: count,
    STARS: site.stars,
    FORKS: site.forks,
  });

  const active = (name) => (key === name ? ' is-active' : '');
  const current = (name) => (key === name ? ' aria-current="page"' : '');

  return fill(layout, {
    LANG: site.locale,
    HEAD: headFor(key, page, profiles),
    MAIN: main,
    REPO: site.repo,
    ACTIVE_TUTORIAL: active('tutorial'),
    ACTIVE_SUBMISSIONS: active('submissions'),
    ACTIVE_CHEATSHEET: active('cheatsheet'),
    CUR_TUTORIAL: current('tutorial'),
    CUR_SUBMISSIONS: current('submissions'),
    CUR_CHEATSHEET: current('cheatsheet'),
  });
}

function renderSitemap() {
  const urls = Object.values(pages).map((p) => canonicalFor(p.dir));
  const today = new Date().toISOString().slice(0, 10);
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u, i) =>
          `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>weekly</changefreq>\n    <priority>${i === 0 ? '1.0' : '0.8'}</priority>\n  </url>`
      )
      .join('\n') +
    '\n</urlset>\n'
  );
}

/** A neutral circular avatar for accounts that no longer exist. */
const AVATAR_FALLBACK =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" role="img" aria-label="Avatar unavailable">' +
  '<circle cx="36" cy="36" r="36" fill="#262a33"/>' +
  '<circle cx="36" cy="28" r="12" fill="#4a5162"/>' +
  '<path d="M12 68a24 24 0 0 1 48 0z" fill="#4a5162"/>' +
  '</svg>\n';

function copyStatic() {
  let copied = 0;
  if (fs.existsSync(STATIC)) {
    for (const entry of fs.readdirSync(STATIC, { withFileTypes: true })) {
      if (!entry.isFile() || entry.name === 'CNAME' || entry.name.startsWith('.')) continue;
      fs.copyFileSync(path.join(STATIC, entry.name), path.join(OUT, entry.name));
      copied += 1;
    }
  }
  return copied;
}

function build() {
  const profiles = loadProfiles();
  const layout = read(path.join(TEMPLATES, 'layout.html'));

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const written = [];
  for (const [key, page] of Object.entries(pages)) {
    const html = withBase(renderPage(key, page, profiles, layout));
    written.push(write(path.join(page.dir, 'index.html'), html));
  }

  // 404 reuses the layout but is never in the sitemap.
  const notFound = fill(layout, {
    LANG: site.locale,
    HEAD: [
      '<meta charset="utf-8" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1" />',
      '<title>Page not found — GitStart</title>',
      '<meta name="robots" content="noindex" />',
    ].join('\n'),
    MAIN: read(path.join(TEMPLATES, '404.html')),
    REPO: site.repo,
    ACTIVE_TUTORIAL: '', ACTIVE_SUBMISSIONS: '', ACTIVE_CHEATSHEET: '',
    CUR_TUTORIAL: '', CUR_SUBMISSIONS: '', CUR_CHEATSHEET: '',
  });
  written.push(write('404.html', withBase(notFound)));

  fs.copyFileSync(path.join(SRC, 'styles.css'), path.join(OUT, 'styles.css'));
  write('avatar-fallback.svg', AVATAR_FALLBACK);
  write('sitemap.xml', renderSitemap());
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

  // Only written once the custom domain actually resolves — see src/content.js.
  if (site.cname) write('CNAME', `${site.cname}\n`);

  const assets = copyStatic();

  console.log(`GitStart built into public/`);
  console.log(`  ${profiles.length} contributors`);
  console.log(`  ${written.length} pages + sitemap, robots, ${assets} assets`);
  console.log(`  serving from ${site.url}${BASE ? `  (base path ${BASE})` : ''}`);
  console.log(`  CNAME: ${site.cname || 'not written — custom domain not live yet'}`);
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const strict = args.includes('--strict');
  // --only a.md,b.md limits strict checks to the files a pull request added.
  const onlyArg = args.find((a) => a.startsWith('--only='));
  const only = onlyArg
    ? new Set(onlyArg.slice(7).split(',').map((f) => path.basename(f.trim())).filter(Boolean))
    : null;

  try {
    if (check) {
      const profiles = loadProfiles({ strict, only });
      const scope = only ? `${only.size} changed profile(s) strictly, ${profiles.length} total` : `all ${profiles.length} profiles`;
      console.log(`Checked ${scope} — everything is valid.`);
      return;
    }
    build();
  } catch (error) {
    console.error(`\n${error.message}\n`);
    process.exitCode = 1;
  }
}

main();
