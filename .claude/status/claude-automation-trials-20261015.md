---
authored_by: agent
date: 2026-10-15
---

## Task: Prepare the community repo for bounded Claude automation trials
- Status: review-ready
- Blocker: none
- Next action: Review the setup PR, choose its frozen baseline and launch the isolated first Claude task.
- Branch: codex/claude-automation-trials-20261015
- Source prompt: ad-hoc
- Started: 2026-10-15
- Last activity: 2026-10-15
- Files touched:
  - tools/review-claude-trial.mjs
  - tests/claude-trial.test.ts
  - experiments/claude/
  - .github/ISSUE_TEMPLATE/claude-trial.yml
  - README.md
  - HANDOFF.md
- Notes for Claude Code side: Preparation only. The proposed producer task changes lib/coverage/review-packet.ts, tools/prepare-job-review.ts and tests/job-review-packet.test.ts; its implementation is intentionally absent. Trusted evaluator exports from the frozen baseline; it does not execute producer code. No runner, schedule, model invocation, credentials or new GitHub authority were enabled. Jobs-first is the defensible default pending Adam's preference.

## Model-routing preflight
- Work class: deterministic
- Truth source: fixture outcomes, Git state and adversarial validator tests
- Cost of a miss: medium; a false pass could hide changed evidence or out-of-scope work, so machine checks are narrow and independent review remains explicit.
- Model lane: Codex
- Remaining Fable budget: n/a
- Opus checkpoint: none
- Calibration check: not due for this bounded preparation
- Stop condition: validated preparation PR; no claim that Claude has completed a trial.

## Verification

All 10 tests pass, including negative cases for unsafe promotion, altered evidence, missing/duplicate records, committed/dirty/untracked scope changes, symlinks, ignored env files and no execution of submitted code. TypeScript and the Webpack production build pass. Issue-form YAML parses with four required fields. No app surface changed, so no visual preview or deployment was created. Claude runs: zero.
