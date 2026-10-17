---
authored_by: agent
date: 2026-10-15
---

## Task: Compare saved job coverage

- Status: review-ready
- Blocker: none
- Next action: Review the issue #1 contribution and fictional receipt before merge.
- Branch: codex/job-coverage-comparison-20261015
- Source prompt: GitHub issue #1 and October 15 instruction to implement both issues
- Started: 2026-10-15
- Last activity: 2026-10-15
- Files touched:
  - lib/coverage/compare.ts
  - tools/compare-coverage.ts
  - tests/coverage.test.ts
  - docs/reviews/job-coverage-comparison.md
  - docs/reviews/job-coverage-example.json
  - HANDOFF.md
- Notes for Claude Code side: Fifteen tests, TypeScript and production build pass. No lint script exists in the starter. Input types, matcher, dependencies and UI are unchanged. Counts are fictional. The manifest is the original pre-edit baseline; it is intentionally not resealed to hide contribution changes. Keep this independent from issue #2 and preserve private visibility.
