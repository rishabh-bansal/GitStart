# Rebuild review

The dependency-free static approach is a sound basis for GitStart: the tutorial,
contributor wall, and cheatsheet do not need a framework, database, or application
server. The review focused on making that approach reliable and on constraining
automation to changes it can actually validate.

## Findings addressed

| Finding | Correction |
| --- | --- |
| Privileged profile checks inserted contributor-controlled filenames into shell source. | Replace that workflow with trusted default-branch scripts, strict path rules, bounded UTF-8 data, and separate validation and merge jobs. |
| A valid build alone did not establish that a profile belonged to the PR author or that the merged commit matched the reviewed one. | Require one new author-owned profile, recheck the base and head, inspect checks and reviews, and submit the validated head SHA to GitHub's merge API. |
| Bot merges could leave the published website behind. | Call deployment explicitly after maintenance; deployment rebuilds the current default branch and runs verification. |
| Low-dependency code was described as needing no future updates. | Document the remaining Node.js, Actions, hosting, account, and moderation work; add scheduled checks and narrowly scoped update automation. |
| SEO and presentation included misleading signals. | Use the configured public URL, remove hard-coded repository popularity figures, derive the contributor count from records, avoid invented sitemap update dates, and describe structured data without ranking promises. |
| Project-path hosting and local preview had gaps. | Cover local links, assets, avatar fallbacks, manifests, redirects, malformed requests, and traversal handling with regression checks. |
| Contributor instructions and operational guidance were incomplete. | Rewrite the README and contribution guide; document architecture, automatic merge boundaries, deployment, custom domains, and recovery. |

The regression suite checks profile parsing, output escaping, generated metadata
and links, deterministic output, preview server behavior, and automatic merge
policy. Run `npm test` and `npm run build` after changes. These tests complement
browser inspection and live GitHub Actions runs; they do not simulate every GitHub
permission, moderation decision, external service failure, or browser.

## Remaining limits

- Five to ten years of unattended operation cannot be guaranteed. Static output
  stays portable, but runtimes, hosting services, authentication, and external
  profile images remain outside this repository's control.
- The merge policy checks format, ownership, scope, and build safety. It does not
  establish whether a display name is truthful or appropriate; reports still need
  human moderation. Website changes and updates outside the narrow Actions policy
  also need review.
- Daily reconciliation examines the 50 most recently updated open PRs. Older,
  conflicting, duplicate, or invalid submissions may need individual attention.
  Historical filenames are accepted by the site but may be ineligible for the new
  automatic submission policy.
- Repository settings and the deployed result must be checked separately from the
  source. Use the [maintenance guide](MAINTENANCE.md) to verify required checks,
  token permissions, Pages, and a complete merge-to-deployment run.
- Search metadata helps discovery; it cannot promise indexing, rankings, or rich
  results. On a GitHub Pages project URL, the project's `robots.txt` does not
  control crawler behavior for the whole hostname.

Published Git history is retained. Future squash merges can keep individual
changes easy to revert without removing earlier contributor credit.
