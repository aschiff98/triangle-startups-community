---
authored_by: agent
date: 2026-10-15
---

# Turn job-comparison findings into a review packet

## Executive summary

Build a small function and local command that organize saved job-comparison output into a packet Adam can review. This should remove manual sorting while keeping every source, date and uncertainty visible. Use the fictional input in this folder. The result is a proposal for review, with no publication step.

## What to build

Read `experiments/claude/job-review-packet/input.json`. Return JSON with exactly these fields:

- `data`: the original fictional-data label.
- `proposedAdditions`: only findings whose disposition is `missing_confirmed_open`.
- `needsReview`: findings with `availability_unknown`, `scope_unknown` or `closed`. Closure needs an operator decision too.
- `excluded`: findings with `listed`, `duplicate` or `out_of_scope`.
- `summary`: three numeric counts, named `proposedAdditions`, `needsReview` and `excluded`.

Copy each complete finding unchanged, including its nested original record. Preserve source links, reasons, posted dates, first-observed dates and fetch dates. Keep the input order within each group. Leave missing dates unknown. Never infer an employer's hiring intent or turn an unreachable source into a closure.

The supplied input should yield **two proposed additions, three reviews and three exclusions**. All eight original finding IDs must appear exactly once. The startup-support opening belongs in proposed additions too. Make the function deterministic and leave the input unchanged. Invalid input must fail clearly rather than produce a partial packet.

## Writable files

- `lib/coverage/review-packet.ts`
- `tools/prepare-job-review.ts`
- `tests/job-review-packet.test.ts`

Keep the frozen input, reviewer tool, package files, matching, UI, instructions and workflows unchanged. Write the generated packet to stdout. The operator can save it outside the repository for review.

## What done looks like

- A named exported function plus a command runnable with `node --import tsx tools/prepare-job-review.ts path/to/input.json`.
- Tests demonstrate correct grouping, input order, unchanged evidence/dates, duplicates retained as exclusions, closed/unknown records held for review, immutability and useful rejection of invalid input.
- `npm test`, `npm run check` and `npm run build` pass in the isolated trial environment.
- The saved packet passes the independent review command in the runbook. Include the actual command outputs and diff in the PR.
- Record model/settings, elapsed time, corrections, usage if available and remaining uncertainty. An agent's own completion claim is not test evidence.

Use only this private fixture repository. A production account, database client, crawler, email, model call in the product code or deployment connection is unnecessary for this task. Stop if the task seems to require one and report the specific dependency. The operator handles any later production integration.
