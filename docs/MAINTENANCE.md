# Maintenance

GitStart aims for low maintenance by generating portable static files with no npm
dependencies. It cannot promise unattended operation for five or ten years.
Runtime support, GitHub policies, Actions, domains, and contributor moderation still
need occasional attention.

## Local verification

Use Node.js 24 or a newer supported LTS release. No `npm install` is required.
CI uses the current LTS release and runs a weekly build to surface incompatibilities.

```sh
npm run check
npm test
npm run build
npm start
```

Open the local URL printed by the preview server. Check the tutorial, contributor
wall, cheatsheet, missing-page response, and mobile navigation. For URL changes,
test the GitHub Pages path prefix as well as a root-domain deployment.

## Pull request policy

Accept as many useful contributions as can be validated without reducing the
quality of the site. Apply the same criteria to old and new pull requests:

| Change | Handling |
| --- | --- |
| One valid new profile owned by the PR author | Eligible for the guarded profile automation |
| Existing-profile correction or removal | Verify the request and review manually |
| Tutorial, style, accessibility, or generator change | Review the diff and passing checks |
| Verified Dependabot update to approved official Actions, limited to same-major SHA pins | Eligible after the update policy and all checks pass |
| Other workflow changes, major updates, or runtime configuration changes | Review permissions, release notes, and compatibility |
| Duplicate, unrelated, conflicting, or invalid change | Request a focused correction or close with an explanation |

A workflow's success is evidence of its checks, not a blanket approval. Do not merge
a pull request that fails validation and plan to repair it afterward. For stale
contributions, retain the original author's attribution when preparing a reviewed
replacement. Do not guess another contributor's intended identity or personal data.

Keep existing published history. Use squash merges for new pull requests with a
short, descriptive title. Use a revert commit to undo a problem; do not force-push
or replace the default branch to make its history look shorter.

## How automatic merging works

`Build` checks pull requests using read-only permissions. `Maintain pull requests`
runs after successful pull request builds, on a daily schedule, or by manual
dispatch. Its daily pass inspects the 50 most recently updated open pull requests;
maintainers can dispatch it with a specific PR number to inspect an older one.

`Validate and merge candidate` fetches the current files through the GitHub API and
runs trusted code from the default branch. Profile eligibility requires one new,
ordinary file in `src/profiles/`, at most 2 KiB, matching the PR author's username.
The file must contain only `username` and `fullname`; the display name must be
between 1 and 100 characters. Duplicate usernames fail the full-site build.

Before merging, the automation requires successful checks, no outstanding request
for changes, and a clean, mergeable PR. It checks the base and head commits again,
then requests a squash merge with the validated head SHA. Repository rules remain
in force. A changed branch, unavailable API, or uncertain state leaves the PR open.
The workflow explicitly calls deployment afterward because a bot merge alone may
not trigger a push workflow.

The scheduled workflows are recovery aids, not a service guarantee. An eligible
PR outside the daily set of 50 may need a manual dispatch. Monitor failed Actions
runs and periodically review the remaining backlog.

## Repository configuration

The workflows live in `.github/workflows/`; committing them does not configure
repository-level settings. Check the live settings when first enabling automation:

1. Enable GitHub Pages with **GitHub Actions** as the build source.
2. Allow squash merging. The build job is named **Test and build**. Keep required
   checks and branch rules consistent with the intended automatic profile policy;
   requiring human approval for every PR also requires it for profiles.
3. Keep workflow token permissions minimal. Grant write permissions only to the
   jobs that need them.
4. Check Actions policies if a workflow does not run. GitHub can require approval
   for fork contributions. The maintenance workflow uses `workflow_run`; it must
   keep using trusted source and ignore untrusted workflow artifacts.
5. Confirm a test contribution passes checks, merges under the intended rules,
   and leads to a successful deployment.

Never give privileged automation a checkout of untrusted pull request code. Do not
disable branch protections to force through a failed merge. A blocked automatic
merge should remain open for review.

## Hosting and custom domains

The canonical address is configured by `site.url` in `src/content.js`. The default
configuration uses `https://rishabh-bansal.github.io/GitStart` with `site.cname` set
to `null`. A missing `CNAME` file is expected in that configuration.

For a custom domain:

1. Arrange and verify the domain and DNS for this repository, following
   [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
2. Coordinate the Pages custom-domain setting and DNS. Confirm the intended host
   resolves correctly and HTTPS is available.
3. Set `site.url` to the verified HTTPS origin and `site.cname` to its hostname.
   Update public documentation links in the same change.
4. Rebuild and deploy. Check actual responses, internal links, canonical tags,
   social images, the manifest, `robots.txt`, and `sitemap.xml` at the public URL.

Do not point canonical URLs at an unapproved or unreachable domain. A `CNAME` file
does not register a domain, configure DNS, or prove ownership.

## Updates and occasional checks

Dependabot checks GitHub Actions monthly. Automatic acceptance is limited to
authenticated Dependabot PRs that modify existing workflow files and only replace
approved official Actions' SHA pins and matching version comments within the same
major version. The automation verifies each new SHA against the official version
tag. Changes to permissions, commands, triggers, or other workflow content need
human review, as do major version updates.

There is no npm dependency tree, but GitHub Actions and the Node runtime still
need supported versions. CI follows `lts/*`; use the
[Node.js release schedule](https://nodejs.org/en/about/previous-releases) when
updating the local minimum or investigating a new-LTS failure. Run all checks before
changing runtime configuration. A weekly build can detect drift; it cannot repair
arbitrary breaking changes.

Check periodically, and after a reported problem:

- Recent build, profile, and deployment runs are succeeding.
- Open valid pull requests are not stuck on permissions, conflicts, or stale checks.
- The public pages, domain, HTTPS, and external profile images behave as expected.
- Tutorial instructions still match GitHub's interface and supported authentication.
- Page titles, canonical URLs, social previews, and sitemap entries describe the site.

Search improvements should help real beginners: clear explanations, useful links,
fast pages, accessible navigation, and accurate metadata. Do not add keyword
stuffing, hidden content, fabricated statistics, or unsupported ranking promises.

On GitHub Pages project sites, `public/robots.txt` is published below the project
path. Crawlers normally read robots directives at the hostname root. Keep the
sitemap available at its documented project URL; if you control the hostname root,
advertise that sitemap there, or submit it through the search engine's webmaster
tools. The file alone does not guarantee sitemap discovery or indexing.
See Google's [robots.txt location rules](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt)
and [sitemap submission guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Deployment failures and recovery

Inspect the failed run before changing configuration. Build failures, permission
failures, and domain failures need different fixes.

If a bot merged a profile but no deployment followed, check the automation's
deployment trigger. GitHub usually suppresses workflow events produced with
`GITHUB_TOKEN`; explicit dispatch events are an exception. See
[GitHub's workflow event reference](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).
The deployment workflow can also be run manually from the Actions page.

If a change broke the website, revert that change in a new commit, run verification,
and redeploy. If hosting needs to move, build the site and publish `public/` to a
static host, preserving URLs where possible. Keep the repository source, contributor
records, and Git history together so the project remains reproducible.
