# Contributing to GitStart

Thanks for being here. This project exists so people can practise contributing to open
source, so a contribution that goes wrong is not a failure — it is the exercise working. The
automated check will tell you what to change, and you can push a fix to the same branch as
many times as you need.

The full walkthrough is at **[gitstart.js.org](https://gitstart.js.org)**.

---

## Adding yourself to the contributor wall

### The rules, in full

1. **One new file.** Your pull request should add exactly one file and change nothing else.
2. **In `src/profiles/`.** Not the repository root, not `Students/`, not anywhere else.
   The path is `src/profiles/YOUR-USERNAME.md`, relative to the top of the repository.
3. **Named after your GitHub username**, ending in `.md`. Not `.txt`.
4. **Containing exactly this**, including both lines of three hyphens:

   ```markdown
   ---
   username: YOUR-USERNAME
   fullname: Your Full Name
   ---
   ```

That's it. No bio, no links, no images — the site only reads those two fields.

### What each field means

| Field | What goes in it |
|---|---|
| `username` | Your **GitHub handle** — the name in your profile URL, e.g. `octocat` for `github.com/octocat`. This fetches your avatar, so it has to be exact. |
| `fullname` | How you want your name shown on the wall. Any spelling or capitalisation you like. |

### Before you open the pull request

- Check the **base repository** dropdown says `rishabh-bansal/GitStart` and the base branch
  is `master`. If you forked a fork, GitHub sometimes preselects a different project, and
  your pull request will land somewhere it cannot be merged.
- Run `git status` and confirm exactly one new file is listed.

### After you open it

A check runs automatically within a minute:

- **If something is wrong**, a comment appears saying precisely what. Fix it, commit, and
  push to the same branch — the check reruns on its own. Do not open a new pull request.
- **If everything is right**, it merges automatically and your profile appears on the site a
  minute or two later.

---

## Common problems

**"I pushed but nothing happened."**
You probably cloned the original repository instead of your fork. Run `git remote -v` — the
URL should contain your username. If it doesn't, re-clone from your fork.

**"It asks for a password and rejects it."**
GitHub stopped accepting account passwords for git in 2021. You need a personal access token
from [github.com/settings/tokens](https://github.com/settings/tokens), pasted where it asks
for a password.

**"The check says my frontmatter is invalid."**
Nine times out of ten it is a missing `---` line, or `username` containing a real name
instead of a GitHub handle. The comment on your pull request names the exact problem.

**"My pull request changes hundreds of files."**
Your fork has drifted from the original. The quickest fix is to delete your fork, fork again,
and redo the change on a fresh branch.

---

## Contributing to the site itself

Improvements to the tutorial wording, the stylesheet, the generator, or the accessibility of
the site are all welcome — and unlike profile pull requests, they get reviewed by a human.

```bash
node build.js --check   # validate all profiles
node build.js           # build the site into public/
npm start               # build and serve at http://localhost:8080
```

There are no dependencies and no `npm install` step. If you find yourself wanting to add a
package, please open an issue first — keeping this project dependency-free is deliberate, and
is the reason it still builds nine years after it was written.

Things that are genuinely useful:

- Wording in `src/content.js` that would be clearer to someone who has never used git
- Accessibility fixes
- Translations of the tutorial
- A test that would have caught a bug you just hit

## Reporting a problem

If any instruction here or on the site is unclear or wrong,
[open an issue](https://github.com/rishabh-bansal/GitStart/issues). Confusing instructions are
real bugs in a project whose entire purpose is teaching, and reporting one is a more valuable
contribution than adding a profile.

## Code of conduct

Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
