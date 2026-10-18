---
authored_by: agent
date: 2026-10-17
---

## Task: Define the job-export contribution and welcome separate tool/source proposals
- Status: review-ready
- Blocker: none for the documentation; a real comparison needs both approved saved inputs.
- Next action: Adam reviews this documentation PR; Atishay can choose whether to accept issue #8.
- Branch: codex/job-export-starter-20261017
- Source prompt: ad-hoc
- Started: 2026-10-17
- Last activity: 2026-10-17
- Files touched:
  - README.md
  - CONTRIBUTING.md
  - AGENTS.md
  - HANDOFF.md
  - .claude/status/community-job-export-starter-20261017.md
- Notes for Claude Code side: Issue #8 is published, voluntary and unassigned. It calls for an offline export importer/report, reusing only the three comparator files from the pinned archived PR #3 commit. The original issues #1/#2 and PRs #3/#4/#5 stay closed. No importer, real data comparison, tool prototype, new source connection or production change is implemented by this documentation PR. User-selected public-source research and local fixture tools are welcome as separate issues/branches. Scope and terms for maintained integrations remain separate decisions. Preserve all prior privacy, design, evidence, verification and merge boundaries.

## Verification

The documentation branch passes the 2 existing tests, typecheck and production Webpack build on Node 24.19.0. A separate disposable checkout verified the issue's exact three-file restore and fictional comparator command, with all 15 resulting tests passing. No importer was built. No application UI or workflow changes are involved. Read the exact pushed PR's hosted Node 22 check before claiming it passes.

## Next

The contributor begins with the agreed export format and fictional examples. A real run waits for the sanitized aggregator export and an approved saved Triangle Startups public-job snapshot; neither is supplied by opening this issue.
