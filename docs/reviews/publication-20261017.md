---
authored_by: agent
date: 2026-10-17
---

# Community publication review

## Executive summary

The publication copy has a fresh independent history with GitHub no-reply commit identities, the MIT License, fictional examples and no connection to production. The prior repository is retained privately because its commit and workflow metadata contained a personal author contact address that the owner did not want published. Its Git objects, PR records and workflow records were not imported into the new repository. This review found no application credentials or real candidate records in the inspected content; it is a bounded publication check, not a claim that every possible vulnerability has been ruled out.

## Inspected material

- All four prior branch tips and their reachable history, including PR head and merge refs: eight commits, 74 distinct file blobs, including five non-merge commits scanned by Gitleaks.
- All source, fixture, manifest, notice and documentation paths across those versions. Real company evidence holds were already replaced with a fictional hold. URLs in the examples use reserved test domains. The provenance manifest contains hashes, not private source history.
- Ten saved screenshots, inspected visually and for embedded metadata. They show fictional jobs and candidate examples. Image metadata contains color-space and dimension fields, with no location, device identity or personal metadata.
- Five issue/PR descriptions, zero issue comments and zero inline review comments. Review records were also retrieved. Descriptions were recreated without old Git references; screenshot links use the new contribution commit.
- Five workflow runs and their ten downloaded log files; zero workflow artifacts. Gitleaks returned no credential findings in the Git diff history or downloaded logs. A separate pattern pass examined all distinct text blobs and commit/discussion metadata, which is how the author contact address was found.
- Repository configuration: no application secrets, variables, environments, deploy keys, webhooks, deployments or release assets. Only the owner held collaborator access. The read-only test workflow has no application credential, deployment step, privileged PR trigger or model call.

Gitleaks v8.30.1 was downloaded from its [official release](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1), and the archive matched its published SHA-256 checksum. Reports stay outside the public repository because original metadata is part of the private audit material.

## Publication changes

The fresh root publishes the sanitized starter and MIT License. Font notices retain SIL Open Font License 1.1 terms. Contributor documentation explains that submissions are offered under MIT while contributors retain copyright. The original packet manifest remains a historical receipt, not a current document validator.

The coverage, compact-results and Claude preparation branches were recreated from their reviewed file trees with GitHub no-reply author and committer addresses. TypeScript source files remain byte-identical to their prior contribution versions. Existing feature PRs are separate review decisions. The compact-results screenshots are unchanged fictional evidence, not newly claimed production behavior. Claude remains unconnected and unrun.

Private history was preserved by keeping the prior repository private and creating a new independent repository. No old branch was force-pushed, no branch was deleted, no feature PR was merged and no production system was changed. Existing local copies of the old repository still point to the private history; future public contributions should clone the new repository rather than push those old histories into it.

## Validation and limits

Fresh local validation passes for the licensed default-branch starter (2 tests), coverage branch (15 tests), compact-results branch (9 tests) and Claude preparation branch (10 tests). Every branch passes TypeScript and the production Webpack build. There is no lint script in this starter. No application UI was changed by the publication work, so the existing fictional screenshot evidence was inspected without creating another deployment.

Before the visibility switch, check the fresh repository's reachable objects and GitHub-generated PR merge commits for the excluded contact address, verify all configured identities use GitHub no-reply addresses, inspect its recreated descriptions and logs, and confirm the private archive remains private. Then verify public visibility and MIT detection without authentication. Publication does not activate Claude, model hosting, deployment, automatic merge or production data access.

The [Triangle questions proposal](../../proposals/triangle-questions.md) is an unstarted experiment with a conditional generation-cost estimate. It includes no private research collection, model weights, credentials, spending authorization or accuracy claim.
