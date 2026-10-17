---
authored_by: agent
date: 2026-10-15
---

# Claude trial preparation

**The community repo has a prepared jobs automation trial, independent saved-packet/scope checks and a reusable issue form. No Claude trial has run or been connected.** The [runbook](experiments/claude/README.md) sets the experiment, evidence and proposed review thresholds; [the task](experiments/claude/job-review-packet/task.md) asks Claude to turn eight fictional findings into a review packet while changing three files only.

The reviewer tool reads Git changes and JSON without executing submitted code. Export it and its input from the frozen trusted baseline before checking a candidate. It does not provide filesystem isolation or replace tests, builds or source review. Candidate execution belongs in an isolated repository-only environment.

**Next prompt:** Use the merged setup commit, or an explicitly approved exact setup SHA, as a frozen baseline. Choose an isolated Claude environment and per-run model/time/usage limits. Run only the job review-packet task, collect the three-file implementation and packet, independently validate them, record correction/review time, and open a review PR. Keep production integration as a separate review. Jobs is the prepared default; Adam may prefer small product issues as the first experiment.

Existing coverage and compact-results contributions remain separate PRs. This setup does not merge them, change contributor terms or grant Claude access to the main repository.
