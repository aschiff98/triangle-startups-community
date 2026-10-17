---
authored_by: agent
date: 2026-10-15
---

# Job coverage comparison

## Executive summary

The saved-list comparator implements [issue #1](https://github.com/aschiff98/triangle-startups-community/issues/1) with a repeatable local command. The eight fictional examples produce one listed job, two missing open jobs, one availability unknown, one closed, one duplicate, one out of scope and one scope unknown. The open eligible denominator is three jobs: one listed and two missing. This is a fixture result, not evidence of live job coverage.

```sh
node --import tsx tools/compare-coverage.ts fixtures/job-coverage.json
```

The complete output is [job-coverage-example.json](job-coverage-example.json). The CLI validates the existing input shape and dates; malformed records fail with a nonzero exit. No network requests, services or input-file writes run.

## Identity and uncertainty

Identity is employer plus posting URL. Employer names normalize Unicode, case and whitespace. URLs use the standard URL parser, drop only `#apply`/`#application` fragments and `utm_*`, `fbclid`, `gclid` and `msclkid`, sort query keys and remove trailing path slashes. Host case and default ports follow URL-parser behavior. Scheme, host, path case, unknown fragments (including hash-router job IDs) and all other query parameters remain significant. Employer aliases and cross-host posting aliases are not guessed. Trailing-slash and tracking normalization are explicit assumptions for this first comparison.

The first employer record for an identity represents the job; later copies are duplicates. Open/closed conflicts across either list are checked before counting an eligible job as listed or missing. Duplicate reasons retain the conflict. Explicit eligibility conflicts become scope unknown. Unknown employer availability stays unknown even if the roster contains a record. Invalid or credential-bearing URLs cannot establish a match or miss. Original source links and all three dates are retained on copied output records.

`summary.employerRecords` counts every supplied employer record; `rosterRecords` counts roster inputs. `uniqueComparableJobs` counts valid employer/URL identities, including excluded or unresolved identities. Disposition counts sum to the employer input count. `confirmedOpenEligibleJobs` is listed plus missing confirmed open, excluding duplicates, closed, unknown and out-of-scope records.

## Validation and next step

Fifteen tests cover the original matcher baseline plus the comparator, including all fixture outcomes, URL identity, distinct employers, duplicate counts, conflicts, unknowns, dates, frozen-input immutability and CLI success/failure. Typechecking and the production build pass. The starter has no lint script. Review the code and receipt before merging; a later real comparison still needs checked employer URLs, availability, scope and dated roster observations.
