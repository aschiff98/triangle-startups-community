---
authored_by: agent
date: 2026-10-17
---

# Contributing

Read the [work table](README.md#what-is-ready-and-what-is-next) before choosing a task. The first two issues already have implementations in PRs #3 and #4. Review those PRs or agree a follow-up instead of building the same features again. A proposed project is not an assigned task or permission to connect services, spend money or run an agent.

## Start a contribution

1. Read the chosen issue, its allowed files and acceptance criteria. For new work, propose the user problem, shareable inputs, a small deliverable and what done looks like in an issue. Agree the scope and terms before implementation.
2. Fork this repository on GitHub. No collaborator invitation or private-repository access is needed. Clone your fork using its clone URL, then run the commands below from its folder.

```sh
git remote add upstream https://github.com/aschiff98/triangle-startups-community.git
git fetch upstream
git switch -c codex/short-task-name upstream/main
npm ci
```

Use Node 22. A short issue note describing the chosen scope helps avoid duplicate work; it is not a paid assignment or a promise of integration. For an existing PR review or trial, use that PR's exact branch and record the starting commit. Do not assume unmerged files are on `main`. Read [AGENTS](AGENTS.md) before asking an agent to work here.

## What done looks like

The change solves the issue's stated problem, includes the relevant fictional examples and checks, and is ready for someone else to review. Keep the contribution bounded to the agreed paths and acceptance criteria. New dependencies, data sources, crawlers, matching changes or ongoing maintenance need a separate scope discussion. Repository settings, workflow permissions, secrets and production integrations are maintainer decisions, outside an ordinary feature task.

Never add private candidate data, credentials, environment files, database integrations or deployment automation. No production systems are available in this project. Keep private conversations and real resumes out of commits, issues, logs and screenshots. Use a GitHub no-reply commit address if you do not want a personal address in public history; check author and committer metadata before pushing.

The packet manifest records the original exported packet. Its verifier checks historical document hashes and is not a validator for this licensed publication. Review your Git diff and run:

```sh
npm test
npm run build
npm run check
```

Open a ready-for-review pull request from your branch into **aschiff98/triangle-startups-community → main**. Link the issue; explain what changed, why it matters and an example of the result. Include the commands and results, the starting commit, any assumptions and remaining unknowns. UI changes also need screenshots at 1440px, 768px and 390px, keyboard/disclosure checks, a console-error count and an overflow check. Preserve existing tokens and fonts. A patch or a green check alone does not establish that the acceptance criteria are met.

## Review and branch protection

`main` requires a PR and the **Test, build and types** GitHub Actions check from an up-to-date branch. All review conversations must be resolved. Force pushes and deletion of `main` are blocked, and admins are subject to the same rules. A second approving reviewer is not required while Adam is the sole maintainer, so his own PRs remain mergeable. Adam decides what to merge; agents stop at a review-ready PR unless he explicitly authorizes that merge. Sharing the owner's GitHub credentials does not provide an independent human approval gate.

If GitHub says the branch is behind, update your task branch without rewriting its history:

```sh
git fetch upstream
git merge upstream/main
# Resolve conflicts, repeat the three checks, then push your task branch.
git push origin HEAD
```

Never push directly to `main`, force-push or weaken protection to get a PR through. If a check fails, fix the cause and push a normal commit. If a check has not run, report the missing result; do not invent a status. PRs created before Actions was enabled may need a new check after their next branch update.

Checks use a GitHub-hosted runner, pinned actions and a read-only repository token. They do not use application secrets or a privileged `pull_request_target` workflow. A maintainer may need to approve a first-time fork's checks under GitHub's settings. There is no automatic merge or production deployment. A community merge does not update the live site. Any later integration into the private product is a separate PR and review. See [GitHub's fork workflow documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request).

## Terms and credit

The [README terms](README.md#contribution-terms) apply to the two starter issues. Public credit names the actual work and uses the contributor's approved name/link. By submitting a contribution you authored, you offer it under this repository's MIT License and retain your copyright. Code copied from another project needs an identified owner, compatible license and reuse permission. Preserve third-party notices. This repository does not transfer ownership of future work or extend a general license to the private platform. Integration into Triangle Startups is a separate human review.
