---
authored_by: agent
date: 2026-10-17
---

## Task: Protect community main and clarify the contributor workflow
- Status: review-ready
- Blocker: none
- Next action: Adam reviews PR #6; the guide reaches main only after his merge decision.
- Branch: codex/public-release-review-20261017
- Source prompt: ad-hoc
- Started: 2026-10-17
- Last activity: 2026-10-17
- Files touched:
  - README.md
  - CONTRIBUTING.md
  - AGENTS.md
  - .github/pull_request_template.md
  - HANDOFF.md
  - docs/reviews/publication-20261017.md
  - .claude/status/community-contributor-guide-20261017.md
- Notes for Claude Code side: Main protection is already enabled through GitHub settings. PRs, current checks, an up-to-date branch and resolved conversations are required, including for admins. Force pushes and deletion are blocked. A second approval is not required while Adam is the sole maintainer. Agents must still wait for an explicit merge instruction. PRs #3/#4 are implemented but unmerged, #5 prepares an unrun Claude trial, and issue #7 is a Q&A proposal. Do not duplicate work, merge features, connect services or start paid execution. Legacy PRs need fresh current-repository checks after a branch update. This PR changes contributor/reference documents only; run tests, typechecking and build before committing, then read its current hosted check result.

## Verification

Local `npm test` passes both starter tests; `npm run build` and `npm run check` pass on Node 24.19.0. The existing GitHub workflow uses Node 22. No lint script exists, and no application UI was changed. GitHub API readback and the saved rule's UI both confirm the live protection settings. Read the PR's current hosted check before calling the branch ready to merge; do not substitute earlier feature-branch evidence.
