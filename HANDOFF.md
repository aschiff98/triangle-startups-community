---
authored_by: agent
date: 2026-10-17
---

# Community review queue

`main` is protected as of 2026-10-17: PRs, an up-to-date branch, the GitHub Actions **Test, build and types** check and resolved review conversations are required. The rule includes admins and blocks force pushes and deletion. Required second approvals are zero while Adam is the sole maintainer; this is not an independent human identity gate. Agents must stop at a review-ready PR and wait for Adam's explicit merge instruction.

The [README work table](README.md#what-is-ready-and-what-is-next), [contributor guide](CONTRIBUTING.md) and [agent instructions](AGENTS.md) explain access, scope, terms, checks and stopping points. These documentation changes await review in [PR #6](https://github.com/aschiff98/triangle-startups-community/pull/6); they reach the default branch only when Adam merges it.

| Work | Review state on 2026-10-17 | Next action |
| --- | --- | --- |
| Coverage comparator | Implemented in [PR #3](https://github.com/aschiff98/triangle-startups-community/pull/3), unmerged. | Review the existing implementation; do not rebuild issue #1. |
| Clear next actions | Implemented in [PR #4](https://github.com/aschiff98/triangle-startups-community/pull/4), unmerged. | Review the screenshots and implementation; do not rebuild issue #2. |
| Claude trial preparation | [PR #5](https://github.com/aschiff98/triangle-startups-community/pull/5), unmerged; no Claude run. | Review the bounded task/checker and select an exact starting commit before authorizing a trial. |
| Triangle Q&A | [Issue #7](https://github.com/aschiff98/triangle-startups-community/issues/7) and brief in PR #6; no prototype. | Agree a first task, source permissions, evaluation and contribution terms. |

The feature PRs predate Actions activation in this final repository. They have prior exact-commit validation, but the required check here must run after their next branch update before merge. Do not manufacture a passing status or bypass protection. PR #6 runs current-repository checks on its documentation updates.

## Publication boundary

The community starter is public under MIT using a fresh independent Git history. Both earlier repository copies remain private because the owner chose not to publish their personal author contact metadata. Commit-email privacy is enabled, and the final repository's generated PR merge commits use GitHub no-reply identities. The public repository recreates the original issues and separate contribution PRs without copying old Git objects or workflow records. Clone the new community repository for future work; do not push branches from an old local clone into it.

The separate coverage, compact-results and Claude preparation PRs remain for review. Claude has not run or been connected. Publication does not deploy Triangle Startups or grant access to its private platform.

The next proposed project is a small, self-hostable Triangle startup Q&A experiment. Read proposals/triangle-questions.md for the ownership distinction, approved-source requirement, citation/refusal checks and conditional $6.35 generation estimate for 10,000 short questions. No inference, training, new credentials or spending was started.

**Next prompt:** Review PR #6 for the contributor guide, publication receipt and Q&A proposal, then review the separate feature PRs. For a Q&A experiment, first choose one explicitly shareable or fictional collection and a frozen question set, and agree scope and terms. Build any authorized prototype in a separate reviewed PR. Keep paid execution, hosting, model-weight publication and production integration as later concrete decisions.
