# Contributing to GitStart

GitStart gives beginners a place to practise the pull request workflow. A small,
focused change is enough. If instructions are confusing, reporting that confusion
is a useful contribution too.

Read the [tutorial](https://rishabh-bansal.github.io/GitStart/) or follow the
[README quick start](README.md#make-your-first-contribution).

## Before you begin

- Create a GitHub account and install [Git](https://git-scm.com/downloads).
- Fork `rishabh-bansal/GitStart`, then clone your own fork.
- Use a separate branch for each contribution.
- If this is your first Git commit, configure your name and email. You can use
  the private commit email shown in your
  [GitHub email settings](https://github.com/settings/emails).

Run these commands inside your clone, replacing the example values. They configure
this repository only:

```sh
git config user.name "Your Display Name"
git config user.email "YOUR-COMMIT-EMAIL"
```

For HTTPS authentication, follow GitHub's
[credential setup guide](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git).
GitHub CLI and Git Credential Manager support signing in through a browser.
Your GitHub account password is not a Git password. Never put access tokens,
passwords, or private keys in a profile or commit.

## Add your profile

Create **one new file**, `src/profiles/YOUR-USERNAME.md`:

```markdown
---
username: YOUR-USERNAME
fullname: Your Display Name
---
```

Keep both `---` lines. Use your own GitHub handle, with the same handle in the
filename and `username` field. Use only `username` and `fullname`; do not add a
biography, links, images, or additional content.

Automatic merging requires the username to match the account opening the pull
request. Keep the file at most 2 KiB and the display name between 1 and 100 characters.
Use an ordinary text file, not a symbolic link or an executable file.

`fullname` means your public display name. It does not need to be your legal name.
The site links your card to your GitHub account and loads your avatar from GitHub.
Do not add personal contact information. One profile per GitHub username is enough;
if yours already exists, choose another contribution.

Before committing, run `git status` and check that only your intended file changed.
Stage that file explicitly:

```sh
git add src/profiles/YOUR-USERNAME.md
git commit -m "Add YOUR-USERNAME to contributors"
git push -u origin add-YOUR-USERNAME
```

On GitHub, open the pull request against `rishabh-bansal/GitStart`, branch `master`.
The **Files changed** tab should show your single new profile.

### What happens next

Automated checks validate eligible additions. A valid profile can be merged
automatically only when it meets the automation policy and repository rules.
Drafts, conflicting changes, existing-profile edits, and website or workflow
changes need further action or maintainer review. Passing a profile check is not
an approval of unrelated changes.

If a check fails, read its output, edit your file, then commit and push to the
**same branch**. Your existing pull request updates automatically. Do not open a
second pull request for the same profile.

First-time contributors may need a maintainer to approve running checks. After a
merge, the profile appears once deployment succeeds. Checks, reviews, and GitHub
service availability can delay either step.

## Fix common problems

| Problem | What to do |
| --- | --- |
| `git` is not found | Install Git, then reopen your terminal. |
| Git cannot identify the commit author | Set `user.name` and `user.email` as shown above. |
| Push is denied | Run `git remote -v`. `origin` should point to your fork; check that you signed in to the account that owns it. |
| Invalid profile | Check the two `---` lines, field names, username, and `.md` extension. Read the check output for the specific error. |
| Username already exists | Find the existing profile. If it needs correcting, open an edit for maintainer review. |
| Unrelated files appear in the PR | Keep a copy of your work, update your fork, and start a fresh branch containing only your profile. Do not delete your fork or discard work to fix this. |
| The PR is valid but still open | Check for draft status, conflicts, pending checks, or repository restrictions. A maintainer can review cases outside the automatic policy. |

GitHub's [fork guide](https://docs.github.com/en/pull-requests/how-tos/work-with-forks)
explains how to sync a fork and create a branch from the latest upstream code.
Keep a copy of your work before changing branches or resolving conflicts.

## Improve the website

Tutorial corrections, accessibility improvements, bug fixes, and useful examples
are welcome. Website and automation changes receive human review. Explain the
problem, keep the change focused, and include screenshots when you change the
layout.

Use Node.js 24 or a newer supported LTS release and run:

```sh
npm run check
npm test
npm run build
npm start
```

No package installation is required. Check the affected pages at desktop and mobile
widths, follow their links, and try navigating by keyboard. For browser enhancements,
confirm the core content still works with JavaScript disabled.

Read [ARCHITECTURE.md](docs/ARCHITECTURE.md) before changing rendering or URL handling.
Prefer built-in browser and Node.js features. If a dependency is necessary, explain
the benefit and ongoing maintenance cost in the pull request. Do not mix formatting
changes, contributor data edits, and unrelated fixes into one submission.

Existing profiles include historical filename conventions. Do not rename or remove
other people's profiles just to make them match current conventions. Preserve Git
history and contributor credit.

## Report a problem

[Open an issue](https://github.com/rishabh-bansal/GitStart/issues) with the page or
command you used, what you expected, and what happened. Include your browser or Git
version when relevant. Remove secrets and personal information from logs.

Everyone participating is expected to follow the
[Code of Conduct](CODE_OF_CONDUCT.md).
