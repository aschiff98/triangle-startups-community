---
authored_by: agent
date: 2026-10-17
---

# Triangle Startups community

## Executive summary

Build and review small Triangle Startups experiments in a standalone local app with fictional data. Anyone can read the code, fork it and propose a change. Contributions arrive through pull requests; Adam reviews and decides what to merge. A merge here changes this community project only. It does not update the live Triangle Startups site.

The first two jobs features already have implementations awaiting review. Check the work table below before starting so you do not rebuild them. Humans should read [CONTRIBUTING](CONTRIBUTING.md); coding agents must also read [AGENTS](AGENTS.md).

## What is ready, and what is next?

| Work | Current state | Useful next step |
| --- | --- | --- |
| [Find jobs our saved list missed (#1)](https://github.com/aschiff98/triangle-startups-community/issues/1) | Implemented in [PR #3](https://github.com/aschiff98/triangle-startups-community/pull/3); awaiting review, absent from `main`. | Review the existing comparison and examples. Agree any follow-up before building it. |
| [Make the next three actions clear (#2)](https://github.com/aschiff98/triangle-startups-community/issues/2) | Implemented in [PR #4](https://github.com/aschiff98/triangle-startups-community/pull/4); awaiting review, absent from `main`. | Review the proposed results screen and its screenshots. |
| [Try Claude on a bounded task](https://github.com/aschiff98/triangle-startups-community/pull/5) | PR #5 prepares a task and checks. Claude has not been connected or run. | Review the trial plan and agree the exact starting commit and task before running anything. |
| [Ask questions about Triangle startups (#7)](https://github.com/aschiff98/triangle-startups-community/issues/7) | Proposal only; the [brief](proposals/triangle-questions.md) is in [PR #6](https://github.com/aschiff98/triangle-startups-community/pull/6). No model or data collection is connected. | Agree a small first task, shareable sources, evaluation and contribution terms. |

This table records the review queue on 2026-10-17. Open the linked PR for its live status. A feature on an open PR is available on that PR's branch, not automatically in a clone of `main`. New ideas begin with an issue describing the problem, inputs, a small deliverable and what done looks like.

## Start locally

Use Node 22 and npm. Clone your fork or this repository:

```sh
git clone https://github.com/aschiff98/triangle-startups-community.git
cd triangle-startups-community
npm ci
npm test
npm run check
npm run dev -- --port 3217
```

Open `http://127.0.0.1:3217`. Toggle the empty fixture and expand the evidence. `npm run build` checks the production bundle. Installation downloads dependencies; the app itself uses local fonts and fictional fixtures, needs no account or environment file, and disables Next telemetry. `.example.test` links are fictional.

## How changes reach the product

Fork → choose an agreed task → build and check a branch → open a PR → Adam reviews and merges here → separately review any port into the private Triangle Startups product. See [CONTRIBUTING](CONTRIBUTING.md) for commands and the definition of done. Each task is independent; completing other tasks or providing ongoing maintenance is optional.

`main` requires a pull request, an up-to-date branch, passing **Test, build and types** checks and resolved review conversations. These rules apply to admins too; force pushes and branch deletion are blocked. There is no required second approver because Adam is currently the sole maintainer. GitHub enforces the PR and check requirements; agents must still wait for Adam's explicit merge instruction. See the [protection details](CONTRIBUTING.md#review-and-branch-protection).

## Contribution terms

The two starter issues are voluntary and have **no monetary compensation**. Adam's offered return is **public acknowledgement of the actual contribution, his vouch and concierge help**. Participation does not promise employment, placement, a referral outcome, a deadline or continuing work. Confirm the credit name/link before public acknowledgement. Contributors retain ownership of their work; disclose third-party code and permissions before integration. Later work needs its own agreed scope and terms.

## What this environment contains

It contains no original Git history, private intake, real candidate records, environment files, database clients, analytics or production deployment connection. Real employer holds are replaced by fictional fixtures. `packet-manifest.json` records source hashes, the original audited archive receipt and the separately reviewed collaboration additions. The manifest and its verifier describe the original exported packet, including historical document hashes. They are not a validator for this licensed publication or later contributions. Use Git review, tests, typechecking and build to validate current work.

GitHub Actions checks pull requests without application secrets. A successful check or merge here does not deploy Triangle Startups. Adam reviews any later integration into the private product separately. Keep real resumes, application answers, private conversations and credentials out of issues, commits and screenshots.

The original software and documentation in this repository are available under the [MIT License](LICENSE). MIT permits reuse, modification and commercial distribution when its notice is retained. Bundled fonts and dependencies retain their own licenses; see [NOTICE](NOTICE.md). The license covers the material published here, not the separate private platform or unpublished data. This first environment is for these two jobs experiments; other proposals can be discussed in an issue before implementation.

## Community experiments

The proposed [Claude trial in PR #5](https://github.com/aschiff98/triangle-startups-community/pull/5) prepares a bounded task and independent checks. It has not connected or run Claude. New ideas should begin with an issue that explains the user problem, fictional or explicitly shareable inputs, a small first deliverable and how it will be checked. Starting a discussion does not grant access to private data or production services.

A proposed [Triangle startup Q&A project](https://github.com/aschiff98/triangle-startups-community/issues/7) explores a small self-hostable model with dated sources and a measured cost target. Read the [project brief](proposals/triangle-questions.md) before proposing a first contribution. The model and data collection have not been built or connected.
