---
authored_by: agent
date: 2026-10-20
---

# Triangle Startups community

Help improve how [triangle-startups.com](https://triangle-startups.com) follows startups in Raleigh, Durham, Chapel Hill and RTP. Use this public repository to try small tools, test public data sources and propose improvements. Anyone can make their own copy and submit a change for review.

The larger goal is recurring coverage of funding rounds, product announcements, company developments and jobs, with less manual work. Records should show their sources and dates. Broken sources and stale information should be visible.

This project runs separately from the live site. Contributing requires no private-repository access or production credentials. A merge here does not update triangle-startups.com.

## Ways to contribute

- **Compare job coverage.** [Issue #8](https://github.com/aschiff98/triangle-startups-community/issues/8) is the current starter: compare an aggregator's saved job list with ours and explain the differences.
- **Suggest a public data source.** Share its link, a small example, what it covers, how often it changes, its reuse terms and any cost.
- **Try a small tool.** Propose a useful improvement, such as checking job quality or spotting repeated company records. Explain who it helps and how someone could test it.

For a new idea, open an issue with the problem, a small first result and what done looks like. Agree the scope before building a maintained integration. New dependencies, services, credentials, paid calls, crawlers and schedules need a separate maintainer decision. Read [CONTRIBUTING](CONTRIBUTING.md) for details.

## Optional proposals

Choose a proposal that interests you and comment with your first step. Agree scope and contribution terms before implementation; none is an accepted assignment.

- [Accessible views (#12)](https://github.com/aschiff98/triangle-startups-community/issues/12): make the same job results readable as cards, a list or table, and plain text, with keyboard and accessibility checks.
- [Research tools (#13)](https://github.com/aschiff98/triangle-startups-community/issues/13): turn saved public sources into cited, dated company facts. Start with one offline source adapter and a readable fact sheet.
- [Community guides (#14)](https://github.com/aschiff98/triangle-startups-community/issues/14): prototype essays and how-tos in this local app, using non-executable Markdown, clear authorship and review before publication.

Each issue describes a small first result, checks and follow-up ideas. The job-export comparison below remains the current starter.

## The current starter: job export comparison

Build one command that reads two saved job lists and produces a clear report: jobs in both lists, possible missing roles, duplicates and records needing review. Include source links, dates and reasons. An uncertain listing should not become a confirmed missing open job.

Our [public snapshot](datasets/public-jobs/2026-10-18/README.md) supplies **298 listing rows across 64 employers**, captured October 18, 2026 UTC, in [JSON](datasets/public-jobs/2026-10-18/public-jobs.json) and [CSV](datasets/public-jobs/2026-10-18/public-jobs.csv). Supply a separately sanitized aggregator export for the other side. Preserve all roster rows, unknown dates and shared-link ambiguities. The snapshot does not confirm that the jobs are still open.

The comparison engine is already built but is absent from `main`. [Issue #8](https://github.com/aschiff98/triangle-startups-community/issues/8) gives the exact files to reuse and the completion checklist. Start there rather than rebuilding it. The public search API does not return jobs.

The starter is voluntary and unassigned until accepted. Use fictional examples for tests. The bundled snapshot is approved for sharing; keep other real inputs and reports outside Git unless approved for publication.

## Start locally

Install Node 22, then run:

```sh
git clone https://github.com/aschiff98/triangle-startups-community.git
cd triangle-startups-community
npm ci
npm test
npm run check
npm run dev -- --port 3217
```

Open `http://127.0.0.1:3217`. The app uses fictional examples and local fonts, needs no account or environment file, and disables Next.js telemetry. Installation downloads dependencies. `.example.test` links are fictional.

To contribute, [fork the repository and create a task branch](CONTRIBUTING.md#start-a-contribution). Coding agents must also read [AGENTS](AGENTS.md).

## How changes reach the product

1. Choose an agreed task and build it on a branch in your fork.
2. Run `npm test`, `npm run check` and `npm run build`. Include examples, limitations and the [required UI checks](CONTRIBUTING.md#what-done-looks-like) when relevant.
3. Open a pull request, a proposed change for review. Explain what changed, why it helps and how to check it.
4. Adam reviews and decides whether to merge it here. Moving it into the private Triangle Startups product requires a separate PR and review.

Protected `main` requires an up-to-date pull request, passing checks and resolved review comments. These rules include admins and block force pushes and deletion of `main`. Adam is the sole maintainer, so no independent approving reviewer is required. Agents need his explicit instruction before merging. See [review and protection details](CONTRIBUTING.md#review-and-branch-protection).

Required checks cover tests/build/types, secrets, dependency vulnerabilities and CodeQL analysis of application code and workflows. Repository secret scanning and push protection are enabled too. CI has no application secrets; only CodeQL can upload security results. Outside contributors need approval before their workflows run. Installation hooks are disabled, but deliberately running tests still executes code. Review unfamiliar changes and use a disposable environment without credentials. Passing checks do not prove code is free of malware. There is no automatic merge or production deployment. Read [SECURITY](SECURITY.md) for the thresholds, remaining limits and private reporting route.

## Contribution terms

The current starter and two completed starter tasks are voluntary, with **no monetary compensation**. The offered return is public acknowledgement of the actual work, Adam's vouch and concierge help. Confirm the credit name/link before publication. Participation promises no employment, referral result, deadline or ongoing maintenance. Later work needs separately agreed scope and terms; optional proposals do not create paid assignments.

The optional proposals above are also unpaid. Agree their scope, credit and any support in the issue before implementation; the starter's vouch and concierge offer does not automatically extend to every proposal.

Contributors retain copyright. Contributions use this repository's [MIT License](LICENSE). Identify copied code and its reuse permission, and preserve third-party notices. Fonts and dependencies keep their own licenses; see [NOTICE](NOTICE.md). This license covers the published community project, not the private platform or unpublished data.

## Data and access

This project contains fictional examples and the labeled public-job snapshot. It has no private platform history, private records, production credentials, database connection or deployment connection. Keep resumes, application answers, private conversations and credentials out of commits, issues, logs and screenshots.

`packet-manifest.json` is a historical export receipt. Its verifier does not validate current contributions.

## Completed work and parked ideas

| Work | Status |
| --- | --- |
| Comparison engine | [#1](https://github.com/aschiff98/triangle-startups-community/issues/1) completed; closed [PR #3](https://github.com/aschiff98/triangle-startups-community/pull/3) preserves the code. Absent from `main`; reuse it for #8 as instructed there. |
| Results-screen actions | [#2](https://github.com/aschiff98/triangle-startups-community/issues/2) completed; closed [PR #4](https://github.com/aschiff98/triangle-startups-community/pull/4) preserves the code, also absent from `main`. |
| Claude trials | [PR #5](https://github.com/aschiff98/triangle-startups-community/pull/5) parked. Claude has not been connected or run. |
| Triangle startup Q&A | [#7](https://github.com/aschiff98/triangle-startups-community/issues/7) and the [proposal](proposals/triangle-questions.md) are for discussion. No model, training, corpus collection or hosting is connected. |

These are references, not assignments to repeat. Check the current issue before starting.
