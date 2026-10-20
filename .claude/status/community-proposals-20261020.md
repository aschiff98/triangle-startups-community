---
authored_by: agent
date: 2026-10-20
---

## Task: Publish three optional community proposals and link them from the README
- Status: review-ready
- Blocker: none
- Next action: Review the documentation PR; merge only on Adam's explicit instruction.
- Branch: codex/community-proposals-20261020
- Source prompt: ad-hoc; user selected publication of the three tightened drafts and a README update PR.
- Started: 2026-10-20
- Last activity: 2026-10-20
- Files touched:
  - README.md
  - CONTRIBUTING.md
  - HANDOFF.md
  - .claude/status/community-proposals-20261020.md
- Notes for Claude Code side: Branch starts at c89ff438a70244b1567b99471de9e05074c03b02, merged PR #11. Issues #12/#13/#14 are published, optional and unassigned; #8 remains the current job-export starter. This branch only links and explains the proposals. Do not implement them or change dependencies, licenses, workflow authority, repository settings or production access under this documentation task. No additional personal-credit or concierge commitments were made.

## Milestone · 2026-10-20

Reviewed the supplied drafts against current community instructions. Posted accessible views (#12), offline research tools (#13) and community guides (#14) after checking all existing issues for duplicates. The connected GitHub App rejected creation with 403; existing authenticated CLI access completed the authorized publication without app-permission changes. Issue content omits local authoring metadata and preserves the voluntary scope/terms and production boundary.

## Verification

Read back issues #12/#13/#14 and verified exact prepared bodies, expected labels, open state and no assignees. The existing 2 tests passed, typechecking passed and the production Webpack build passed on Node 24.19.0. Relative links/heading anchors, all three proposal URLs, agent authorship, unpaid scope/terms and contact/token-pattern checks passed. `git diff --check` passed. Check the exact pushed head's hosted Node 22 result separately. No application UI changed; no screenshots or deployment are required.

## Next

Open the README/contributor-guide PR for review and stop before merge. Proposal scope, renderer dependencies and contribution terms are agreed on each issue before implementation. Security hardening remains separately scoped work.
