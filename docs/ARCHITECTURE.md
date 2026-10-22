# Architecture

GitStart is a static website generated from text files. It uses Node.js built-in
modules instead of an application framework or package dependency tree. The output
can be hosted by any web server that serves static files.

## Build and content

`build.js` reads contributor records and site content, renders HTML templates, then
replaces `public/` with a complete build. Do not store source files in that folder.
The generator does not need a database, GitHub API request, or network access to
build the pages.

| Input | Responsibility |
| --- | --- |
| `src/content.js` | Canonical site URL, repository settings, page metadata, tutorial steps, and cheatsheet |
| `src/templates/` | Shared layout and page structure |
| `src/styles.css` | Responsive styling and themes |
| `src/site.js` | Optional browser enhancements |
| `src/profiles/*.md` | Contributor usernames and display names |
| `static/` | Favicons and other public assets |

The main routes are `/`, `/submissions/`, and `/cheatsheet/`. The build also produces
`404.html`, styles, an avatar fallback, a sitemap, and crawler directives. `CNAME`
is conditional on custom-domain configuration.

`npm run check` validates contributor data without publishing anything. `npm test`
runs regression checks; `npm run build` renders the site. `npm start` builds and
serves a local preview. The preview server is a development tool, not a hosting
requirement.

## Contributor records

A profile stores `username` and `fullname` between two `---` lines. This deliberately
small format is not a general-purpose Markdown or YAML publishing system. Profile
text is data; it must never be evaluated as JavaScript, a shell command, or HTML.

The generator validates usernames, rejects duplicate accounts without regard to
case, escapes names before rendering, and sorts cards by display name. Historical
filenames do not all match their usernames; preserve those records and apply new
submission rules to new contributions.

The full-site parser preserves older records and accepts display names up to 120
characters. New automatic submissions use a separate, stricter policy: only the
two documented fields, at most 2 KiB, and a display name of at most 100 characters.
Passing the general build is therefore necessary but not sufficient for auto-merge.

The browser requests avatars from GitHub. Those images can become unavailable if
an account changes or GitHub is unreachable. Display names and profile links are
still part of the generated HTML. Adding or changing a profile requires rebuilding
and redeploying the site.

## Browser behavior and accessibility

Navigation, tutorial steps, contributor links, and the cheatsheet are ordinary HTML.
Small scripts enhance the experience; they must not be necessary to read the guide.
Keep semantic headings, visible keyboard focus, descriptive link text, meaningful
form labels, reduced-motion support, and a working skip link when editing the UI.

Keep the site usable without third-party fonts or JavaScript services. Features
that require an external service should have a useful fallback.

## URLs and search discovery

`site.url` in `src/content.js` is the canonical public address. A GitHub Pages
project site has a path prefix such as `/GitStart`; generated links, assets,
metadata, and manifests must respect it. Test both project-path and custom-domain
configurations when changing URL handling.

Each page needs a distinct title, description, canonical URL, and heading that
describe its visible content. Sitemap entries and structured data must refer to
real pages. Do not invent update dates, reviews, contributor claims, or search
features. Search engines decide indexing, rankings, and rich-result eligibility.

Use a verified public domain before changing canonical URLs. The migration steps
are in [MAINTENANCE.md](MAINTENANCE.md#hosting-and-custom-domains).

## Automation boundaries

The `Build` workflow runs pull request checks with read-only permissions and no
repository secrets. After a successful run, `Maintain pull requests` loads trusted
automation from the default branch. It fetches candidate files as bounded text and
does not execute pull request scripts or download their workflow artifacts.

Profile auto-merge is narrowly scoped. A passing profile validator does not approve
changes to the generator, website, Actions configuration, or another contributor's
record. A separate policy permits verified Dependabot updates that change only
same-major commit pins for approved official Actions. Check the current workflow
and maintenance guide before extending either policy. Validate the current commit
before merging, and never merge broken data on the assumption that a later repair
will fix production.

## Keeping the design small

Prefer a built-in feature over a new library when both solve the problem clearly.
Keep content separate from rendering, test meaningful edge cases, and retain
portable static output. Add a framework or service only for a concrete requirement
that justifies its long-term cost.

Preserve published Git history. A future squash merge provides one revertible
commit per pull request without erasing earlier contributors' work.
