---
authored_by: agent
date: 2026-10-17
---

# Contributing

Choose one starter issue and read its paths and acceptance criteria. Fork this public repository, clone the fork, and create a branch. No collaborator invitation or private-repository access is needed. A short issue note describing the chosen scope helps avoid duplicate work; it is not a paid assignment or a promise of integration.

The packet manifest records the original exported packet. Its verifier checks historical document hashes and is not a validator for this licensed publication. Review your Git diff and run:

```sh
npm test
npm run build
npm run check
```

Open a pull request into this repository's `main`, link the issue, explain the resulting behavior and include the checks and remaining unknowns. Use fictional fixtures. UI changes also need screenshots at 1440px, 768px and 390px, keyboard/disclosure checks, a console-error count and an overflow check. Preserve existing tokens and fonts. Read [AGENTS](AGENTS.md) when using an agent.

Keep one contribution bounded to the issue. New dependencies, data sources, crawlers, matching changes or ongoing maintenance need a separate scope discussion. Never add private candidate data, credentials, environment files, database integrations or deployment automation. No production systems are available in this project.

Checks use a GitHub-hosted runner, pinned actions and a read-only repository token. They do not use application secrets or a privileged `pull_request_target` workflow. A maintainer may need to approve a first-time fork's checks under GitHub's settings. Maintainers review and merge; there is no automatic merge or production deployment. See [GitHub's fork workflow documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request).

The [README terms](README.md#contribution-terms) apply to the two starter issues. Public credit names the actual work and uses the contributor's approved name/link. By submitting a contribution you authored, you offer it under this repository's MIT License and retain your copyright. Code copied from another project needs an identified owner, compatible license and reuse permission. Preserve third-party notices. This repository does not transfer ownership of future work or extend a general license to the private platform. Integration into Triangle Startups is a separate human review.
