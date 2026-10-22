# GitStart

Learn to make a GitHub pull request by making one. GitStart is a free, open-source
practice project: fork the repository, add your profile, and submit a small change.
Merged profiles appear on the contributor wall.

[Start the tutorial](https://rishabh-bansal.github.io/GitStart/) ·
[Meet the contributors](https://rishabh-bansal.github.io/GitStart/submissions/) ·
[Git cheatsheet](https://rishabh-bansal.github.io/GitStart/cheatsheet/)

[![Build](https://github.com/rishabh-bansal/GitStart/actions/workflows/build.yml/badge.svg)](https://github.com/rishabh-bansal/GitStart/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

## Make your first contribution

You need a GitHub account, [Git](https://git-scm.com/downloads), and a text editor.
You do not need Node.js to add a profile. Replace `YOUR-USERNAME` below with your
GitHub username.

1. [Fork this repository](https://github.com/rishabh-bansal/GitStart/fork).
2. Clone **your fork** and create a branch:

   ```sh
   git clone https://github.com/YOUR-USERNAME/GitStart.git
   cd GitStart
   git checkout -b add-YOUR-USERNAME
   ```

3. Create `src/profiles/YOUR-USERNAME.md` with this content:

   ```markdown
   ---
   username: YOUR-USERNAME
   fullname: Your Display Name
   ---
   ```

   Use your GitHub handle for `username`. Your display name will be public; it
   does not have to be your legal name. Add only these two fields.

4. Save, commit, and push that one file:

   ```sh
   git add src/profiles/YOUR-USERNAME.md
   git commit -m "Add YOUR-USERNAME to contributors"
   git push -u origin add-YOUR-USERNAME
   ```

5. Open a pull request with **base repository `rishabh-bansal/GitStart`** and
   **base branch `master`**. Review the **Files changed** tab before submitting.

Automated checks validate eligible contributions and attempt a squash merge
when validation and repository rules allow it. Website changes need maintainer
review. A successful merge appears on the site after a successful deployment;
neither merging nor deployment has a guaranteed turnaround time.

For setup, authentication, and fixing a pull request, see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Work on the website

The site is generated with Node.js built-in modules and served as static HTML and
CSS. There are no npm dependencies, frontend framework, database, or production
application server. Small browser enhancements are optional; the tutorial and
contributor links work without JavaScript.

Use **Node.js 24 or a newer supported LTS release**. No `npm install` is needed.
Continuous integration follows the current LTS release.

```sh
npm run check    # Validate contributor data
npm test         # Run regression checks
npm run build    # Generate public/
npm start        # Build and preview at http://localhost:8080
```

`public/` is generated output. Edit source files, then rebuild; do not commit
generated pages.

| Path | Purpose |
| --- | --- |
| `src/content.js` | Site configuration, page metadata, tutorial, and cheatsheet |
| `src/templates/` | HTML layouts and page templates |
| `src/styles.css` | Styles and responsive layout |
| `src/site.js` | Optional browser enhancements |
| `src/profiles/` | Contributor records |
| `static/` | Icons and other static assets |
| `build.js` | Static site generator |
| `server.js` | Local preview server |
| `test/` | Regression checks |
| `scripts/` | Trusted automation and merge policy |
| `.github/` | Checks, deployment, and contribution automation |

## Built to last

Plain files, portable static output, and a small dependency surface reduce the
work needed to keep GitStart running. They cannot guarantee five or ten years
without maintenance: Node.js, GitHub Actions, hosting, DNS, and external avatars
still change. Automated checks and update proposals help keep that work small.
Eligible new profiles and narrowly validated Dependabot updates to official GitHub
Actions can merge automatically. Source changes and major updates need review.

Keep published Git history and contributor attribution intact. Use squash merges
for future pull requests to keep each change easy to review and revert.

- [Architecture](docs/ARCHITECTURE.md): how the site is generated and indexed.
- [Maintenance](docs/MAINTENANCE.md): deployment, updates, automation, and recovery.
- [Review](docs/REVIEW.md): problems addressed and remaining operating limits.
- [Contributing](CONTRIBUTING.md): profiles, website improvements, and bug reports.
- [Code of Conduct](CODE_OF_CONDUCT.md): expectations for everyone participating.

GitStart is an independent learning project. Participation does not guarantee
credit in third-party contribution programs.

## License and credit

[MIT](LICENSE.md), created by Rishabh Bansal and improved by the project's
[contributors](https://github.com/rishabh-bansal/GitStart/graphs/contributors).
Contributor profiles and the existing commit history preserve the community's
work across versions of the site.
