/**
 * All site copy and configuration, in one place.
 *
 * Edit this file to change what the site says. The build renders this into static HTML.
 */

'use strict';

const site = {
  name: 'GitStart',

  // `url` is used for canonical tags, Open Graph URLs and the sitemap, so it
  // must be the address the site is ACTUALLY reachable at. `cname` writes
  // public/CNAME, which is what tells GitHub Pages to serve a custom domain.
  //
  // These move in two steps, and doing them in the wrong order takes the site
  // offline:
  //
  //   1. Before js.org approves the subdomain, deploy with the GitHub Pages
  //      address below and cname set to null. Setting a custom domain that
  //      does not resolve yet makes Pages redirect the working URL to a
  //      broken one.
  //   2. Once js-org/js.org has merged the entry and DNS has propagated,
  //      switch url to 'https://gitstart.js.org' and cname to 'gitstart.js.org'.
  //
  url: 'https://rishabh-bansal.github.io/GitStart',
  cname: null,

  repo: 'https://github.com/rishabh-bansal/GitStart',
  repoSlug: 'rishabh-bansal/GitStart',
  branch: 'master',
  profileDir: 'src/profiles',
  locale: 'en',
};

/**
 * The tutorial. `body` and `tip` accept inline HTML.
 * `tip` is the "here is the mistake everyone makes" note — keep it concrete.
 */
const steps = [
  {
    id: 'step-1',
    title: 'Fork the repository',
    body:
      `A <strong>fork</strong> is your own complete copy of someone else's project, stored under ` +
      `your own GitHub account. You can change anything in it without affecting the original, ` +
      `which is what makes it safe to experiment.<br><br>` +
      `Open <a href="${site.repo}">${site.repoSlug}</a> and press <strong>Fork</strong> in the ` +
      `top-right corner, then <strong>Create fork</strong>. GitHub will take you to your copy.`,
    cmd: '# Nothing to type yet — this step happens on github.com',
    tip:
      `You'll know it worked when the page title reads <code>YOUR-USERNAME/GitStart</code> ` +
      `instead of <code>${site.repoSlug}</code>, with "forked from" underneath.`,
  },
  {
    id: 'step-2',
    title: 'Clone your fork to your computer',
    body:
      `<strong>Cloning</strong> downloads your fork so you can edit it with real tools instead of ` +
      `in the browser. On <em>your</em> fork's page, click the green <strong>Code</strong> button ` +
      `and copy the HTTPS URL.<br><br>` +
      `Then open a terminal — Terminal on macOS and Linux, Git Bash on Windows — and run these ` +
      `two commands. The second one moves you into the folder you just downloaded.`,
    cmd:
      `git clone https://github.com/YOUR-USERNAME/GitStart.git\n` +
      `cd GitStart`,
    tip:
      `The URL must contain <strong>your</strong> username, not <code>rishabh-bansal</code>. ` +
      `Cloning the original instead of your fork is the single most common mistake here — you ` +
      `won't have permission to push, and you'll only find out at step 6. ` +
      `Run <code>git remote -v</code> to check.`,
  },
  {
    id: 'step-3',
    title: 'Create a branch for your change',
    body:
      `A <strong>branch</strong> is a separate line of work. Making one keeps your change isolated ` +
      `from <code>${site.branch}</code>, so the original stays clean and your pull request contains ` +
      `only what you meant to add.<br><br>` +
      `The <code>-b</code> flag means "create this branch and switch to it in one go". Name it after ` +
      `what you're doing.`,
    cmd: 'git checkout -b add-YOUR-USERNAME',
    tip:
      `Working directly on <code>${site.branch}</code> still produces a valid pull request, but it ` +
      `makes your fork awkward to reuse later. Building the branch habit now costs you one command.`,
  },
  {
    id: 'step-4',
    title: 'Add your profile file',
    body:
      `Create <strong>one new file</strong> in the <code>${site.profileDir}/</code> folder, named after ` +
      `your GitHub username, ending in <code>.md</code>. Use any text editor.<br><br>` +
      `The block between the two <code>---</code> lines is called <strong>frontmatter</strong>. It's ` +
      `structured data the site reads to build your card, so the format has to be exact: three ` +
      `hyphens, the two keys, three hyphens.`,
    cmd:
      `File: ${site.profileDir}/YOUR-USERNAME.md\n\n` +
      `---\n` +
      `username: YOUR-USERNAME\n` +
      `fullname: Your Full Name\n` +
      `---`,
    tip:
      `Four things break this: putting the file in the wrong folder, using ` +
      `<code>.txt</code> instead of <code>.md</code>, forgetting either <code>---</code> line, and ` +
      `typing your real name into <code>username</code>. The <code>username</code> value must be ` +
      `your exact GitHub handle — it's what fetches your avatar. Add nothing else to the commit.`,
  },
  {
    id: 'step-5',
    title: 'Commit your change',
    body:
      `A <strong>commit</strong> is a saved snapshot with a note explaining why you made it. It takes ` +
      `two commands: <code>git add</code> marks which files to include, and <code>git commit</code> ` +
      `saves them.<br><br>` +
      `Name your file explicitly rather than using <code>git add .</code> — that way stray files like ` +
      `<code>.DS_Store</code> can't sneak into your pull request.`,
    cmd:
      `git add ${site.profileDir}/YOUR-USERNAME.md\n` +
      `git commit -m "Add YOUR-USERNAME to contributors"`,
    tip:
      `Run <code>git status</code> first. It should list exactly one new file. If it lists more, ` +
      `you're about to commit something you didn't mean to.`,
  },
  {
    id: 'step-6',
    title: 'Push the branch to your fork',
    body:
      `<strong>Pushing</strong> uploads your commit from your computer to your fork on GitHub. Until ` +
      `you do this, your change exists only locally.<br><br>` +
      `<code>-u origin</code> links your local branch to the matching branch on GitHub, so every later ` +
      `push on this branch is just <code>git push</code>.`,
    cmd: 'git push -u origin add-YOUR-USERNAME',
    tip:
      `For HTTPS sign-in, use <strong>Git Credential Manager</strong>, GitHub CLI, or a personal access token. Never use your ` +
      `account password. Follow ` +
      `<a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#authenticating-with-the-command-line">GitHub’s command-line authentication guide</a>. Keep tokens private; never put them in ` +
      `your profile file.`,
  },
  {
    id: 'step-7',
    title: 'Open the pull request',
    body:
      `A <strong>pull request</strong> asks the original project to take your change. Go back to your ` +
      `fork on GitHub — there'll be a yellow banner offering ` +
      `<strong>Compare &amp; pull request</strong>. Click it, give it a short title, then press ` +
      `<strong>Create pull request</strong>.<br><br>` +
      `That's it. You've contributed to open source. A check runs automatically on your file and tells ` +
      `you if anything needs fixing. Eligible profile-only changes can merge automatically after validation.`,
    cmd: '# Back to github.com — press "Compare & pull request"',
    tip:
      `Before submitting, check the <strong>base repository</strong> dropdown reads ` +
      `<code>${site.repoSlug}</code> and the base branch is <code>${site.branch}</code>. If you forked ` +
      `a fork, GitHub sometimes preselects the wrong target and your pull request lands on a stranger's ` +
      `project. Always check before submitting.`,
  },
];

/** Cheatsheet rows: [command, what it does, when you need it]. */
const cheatsheet = [
  ['git clone <url>', 'Downloads a full copy of a repository, including its entire history.', 'Once, right after you fork.'],
  ['git remote -v', 'Lists the remote repositories your clone talks to.', 'To confirm you cloned your fork and not the original.'],
  ['git status', 'Shows which files changed and which are staged for the next commit.', 'Constantly. When unsure what state you are in, run this.'],
  ['git checkout -b <name>', 'Creates a new branch and switches to it.', 'Before starting any change.'],
  ['git switch <name>', 'Moves to a branch that already exists.', 'Hopping between pieces of work in progress.'],
  ['git branch', 'Lists your branches and marks the current one.', 'When you have lost track of where you are.'],
  ['git add <file>', 'Stages one file to be included in the next commit.', 'After editing, before committing.'],
  ['git commit -m "msg"', 'Saves everything staged as a snapshot with a message.', 'Once per logical chunk of work.'],
  ['git push -u origin <name>', 'Uploads a branch to your fork and links the two.', 'The first push of a new branch.'],
  ['git push', 'Uploads new commits on a branch that is already linked.', 'Every push after the first.'],
  ['git pull', 'Downloads changes from the remote and merges them in.', 'Before starting work, to avoid conflicts later.'],
  ['git log --oneline', 'Shows the commit history, one line per commit.', 'Confirming your commit actually landed.'],
  ['git diff', 'Shows your unstaged changes, line by line.', 'Reviewing your own work before you commit it.'],
  ['git restore <file>', 'Throws away uncommitted changes to a file.', 'When an edit went wrong and you want to start over.'],
  ['git restore --staged <file>', 'Unstages a file without losing your edits.', 'When you added the wrong file.'],
  ['git commit --amend', 'Replaces your last commit with a corrected one.', 'Fixing a typo in the message you just wrote.'],
];

/** One entry per output page. `dir` is the published path. */
const pages = {
  tutorial: {
    dir: '',
    template: 'tutorial',
    title: 'How to make your first GitHub pull request',
    metaTitle: 'How to make your first GitHub pull request — GitStart',
    description:
      'A free, seven-step tutorial that walks complete beginners through forking a repository, ' +
      'committing a change, and opening their first GitHub pull request. No prior git experience needed.',
  },
  submissions: {
    dir: 'submissions',
    template: 'submissions',
    title: 'Contributors',
    metaTitle: 'GitStart contributor wall — practise your first pull request',
    description:
      'Meet the people who have contributed a profile to GitStart. ' +
      'Finish the seven steps and your avatar joins the wall.',
  },
  cheatsheet: {
    dir: 'cheatsheet',
    template: 'cheatsheet',
    title: 'Git command cheatsheet',
    metaTitle: 'Git command cheatsheet for your first pull request — GitStart',
    description:
      'Every git command used in the GitStart tutorial, what each one does, and when you reach ' +
      'for it. A reference for first-time contributors.',
  },
};

const faqs = [
  ['What is a pull request?', 'A pull request proposes changes from one branch to another. It gives maintainers a place to review the difference, run checks, and merge the contribution into the project.'],
  ['Do I need to know how to code?', 'No. This exercise adds a small text file with your GitHub username and display name. You will practise the same fork, branch, commit, and pull request workflow used in software projects.'],
  ['What is the difference between a fork and a clone?', 'A fork is your copy of a repository on GitHub. A clone is a local copy on your computer. Fork first, then clone your fork so you have somewhere you can push your changes.'],
  ['Why did my pull request fail a check?', 'Open the pull request’s Checks tab and read the validation result. Check the folder, file extension, username, and frontmatter. Commit a correction to the same branch and push again; the pull request updates automatically.'],
  ['When will my profile appear?', 'Your profile appears after the pull request is merged and the next website deployment succeeds. Eligible profile-only changes are checked automatically. Changes to existing profiles, code, or documentation need maintainer review.'],
  ['Does this count toward Hacktoberfest?', 'GitStart is a practice project and does not promise event credit. Check the current <a href="https://hacktoberfest.com/participation/">Hacktoberfest participation rules</a>; simple practice contributions may not qualify.'],
];

module.exports = { site, steps, cheatsheet, pages, faqs };
