---
authored_by: agent
date: 2026-10-15
---

# Claude automation trials

## Executive summary

Use this community repository to find out which work Claude can complete with little operator correction. The first prepared task turns saved job-comparison findings into a review packet. It advances the jobs workflow while preserving a checkable answer for every record. The trial has not run; this branch prepares its task, fictional input, independent checker and results record.

The working hypothesis is that Claude can build and repair bounded automations, while ordinary code handles repeatable checks and data processing. A successful trial earns consideration for integration into Triangle Startups. Adam reviews that integration and any increase in authority separately.

## First experiment

Give Claude [the job review task](job-review-packet/task.md) in a clean environment containing only this repository and fictional data. It must return three small code files and a saved JSON packet. The input has eight findings: two proposed additions, three records needing manual review and three exclusions. An unknown or closed job must never become an automatic addition.

The comparison itself is already covered by the community's [coverage contribution](https://github.com/aschiff98/triangle-startups-community/pull/3). This trial exercises the next step, grouping its saved output into a review packet. Claude does not need the main product repository to do it.

## Run one bounded task

1. Review and merge this setup, or explicitly choose its exact commit as the baseline. Record the full SHA before the producer starts. Use one fresh task branch per trial.
2. Use a disposable environment with only this repository. Check that private folders, production credentials, main-repo connectors and deploy authority are absent. A local working directory or a prompt is not a filesystem sandbox. Use the approved agent environment's actual isolation controls.
3. Give Claude the task and writable paths. Choose the model and per-run time/spend limit before starting; record the actual settings. Keep the existing permission prompts. Do not supply a broad GitHub token or bypass permissions to make a run finish.
4. Collect the changed files and saved packet. Run review from the trusted baseline, outside the producer's editable files, using the command below. A green scope check is not an isolation guarantee or proof that the implementation works.
5. Run tests, typecheck and build independently in the clean trial environment. Inspect the source. For UI work, add keyboard/disclosure checks, errors and 1440/768/390px captures. Have the reviewer record corrections and review time.
6. Open a PR for Adam. Keep publication, merging and integration as explicit operator decisions. A run ending without the required evidence is incomplete.

### Independent packet and scope check

Run this from the candidate checkout. `BASE` is the full setup commit chosen before the trial. `/tmp/job-review-packet.json` is Claude's saved output. Review these commands before executing them in the clean trial environment.

```sh
BASE=<full-40-character-frozen-setup-commit>
REVIEW_DIR=$(mktemp -d)
git show "$BASE:tools/review-claude-trial.mjs" > "$REVIEW_DIR/review.mjs"
git show "$BASE:experiments/claude/job-review-packet/input.json" > "$REVIEW_DIR/input.json"
node "$REVIEW_DIR/review.mjs" "$BASE" "$REVIEW_DIR/input.json" /tmp/job-review-packet.json
```

The reviewer exports trusted checks and input from Git instead of running a candidate-edited checker. This command only reads saved JSON and inspects Git changes. It does not execute submitted code, call Claude, fetch websites or publish jobs. It checks the whole diff from the baseline, including committed, staged, dirty and untracked Git-visible changes; ignored caches remain outside that diff. Loadable root env files and symlinked task paths are rejected. Tests and builds execute submitted code, so those belong in the isolated environment too.

A pass says `scope_and_packet_checks_passed`. Test/build verification and source review remain separate requirements. This is a task-specific gate, not a general-purpose code security scanner.

## Record what happened

Copy [run-record.json](run-record.json) into the reviewer-controlled results location and fill it from logs and observation. Keep unavailable values `null`. Record actual model calls or provider usage when available; subscription use does not establish a zero-dollar marginal cost. Never copy credentials or real resumes into the record.

Useful measures are correctness on the checked cases, failures found after the agent said it was done, out-of-scope changes, human corrections, operator review minutes, elapsed time and usage. A successful build by itself says little about the correctness of a proposed job update.

## What earns a broader trial

Proposed review gate: three separately scoped runs with all task acceptance checks passing, no source/date changes, no scope violations and at most five minutes of human review each. These are proposed thresholds, not observed results or automatic promotion rules. Include at least one new frozen case set before drawing a conclusion about unseen inputs. The visible eight-case fixture is a rehearsal, not a blind model benchmark.

Then test saved job-freshness observations, followed by one small product issue. When an automation is ready for the product, extend its existing workflow and review path. Do not create a parallel production controller in this repository.

## Claude integration

This setup adds no active agent runner, schedule, credential or new repository permission. Start with an explicitly launched isolated Claude task. Anthropic also supports [programmatic Claude Code runs](https://code.claude.com/docs/en/headless) and a [GitHub Actions integration](https://code.claude.com/docs/en/github-actions). Activating the latter introduces authentication and GitHub permissions, so it needs a separate concrete setup review after the manual trial establishes value. That future decision should name the exact repository, permitted actions, authentication method and external usage limit.
