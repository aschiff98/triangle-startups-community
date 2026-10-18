---
authored_by: agent
date: 2026-10-17
---

# Triangle Startups public jobs snapshot

## Executive summary

This is the Triangle Startups input for [export-comparison issue #8](https://github.com/aschiff98/triangle-startups-community/issues/8): **298 public listing rows across 64 employers**, comprising 297 startup roles and one startup-support role. These are real public listing facts. They are separate from the fictional fixtures used for tests.

The anonymous website capture occurred between **2026-10-18 00:46:26 and 00:47:45 UTC** (October 17 evening in North Carolina). Every employer/title/posting-URL triple matches the complete [public Markdown roster](https://triangle-startups.com/md/jobs), including repeated links. The [HTML page](https://triangle-startups.com/jobs) reported the same 298 listings. A capture records what was listed then; it does not establish that every employer posting is open now.

## Files

- [public-jobs.json](public-jobs.json): metadata followed by the `publicRoster` array. Use this as the Triangle Startups input to the new importer.
- [public-jobs.csv](public-jobs.csv): the same 298 rows with the same fields and ordering. Empty date/link cells mean unknown, matching JSON `null`.
- [provenance.json](provenance.json): capture sources, row/count checks, saved-capture hashes and SHA-256 checksums for the two downloadable files.

Both files contain only a synthetic row ID, employer, role title, public posting/detail links, the public startup/support category and available dates. They contain no descriptions, internal database IDs, private notes, contacts, applications, candidate records, account data or credentials. The raw HTML/Markdown retrievals are not included in this repository. This specific job-fact snapshot was prepared for publication at Adam's request; it does not authorize publishing other real inputs or reports.

## How to use it

1. Save the JSON or CSV locally and keep its capture metadata with the comparison. Use `provenance.json` to verify its checksum.
2. Import Atishay's separately sanitized export as the employer-side input. Read this file's `publicRoster` as the Triangle Startups side. Do not replace the real roster with the fictional fixture when reporting real differences.
3. Produce the report required by #8. Preserve every roster row, missing dates and source links. State which two snapshots were compared, since their observation times may differ.

The archived comparator's old CLI expects a combined input and requires non-null first-seen/check dates. **This download is not a drop-in file for that CLI.** The importer in #8 needs to read the two inputs and retain unknown dates or explain what needs review. Reuse the comparison engine; do not invent dates to satisfy its old validator. Missing dates must not cause an existing Triangle Startups roster entry to disappear from the presence comparison.

## Fields and evidence limits

| Field | Meaning |
| --- | --- |
| `id` | Synthetic snapshot-row ID derived from employer, title and posting URL. Not a database ID or a new job-matching rule. |
| `employer`, `title` | Names shown on the public roster. |
| `sourceUrl` | Public employer posting or careers-page link shown by Triangle Startups. Preserve its job identifiers. |
| `listingUrl` | Public Triangle Startups detail URL when the Markdown roster linked one; otherwise null. There are 131 such links. |
| `scope` | The public page's category: `startup` or `ecosystem` for the NC IDEA support role. This export does not add new company classifications. |
| `availability` | `unknown` for all rows. Roster presence was observed; employer availability was not independently rechecked for this export. |
| `postedOn` | Employer publication date when the anonymous response identified one; null for 104 rows. An old crawl/edit date was not relabeled as publication. |
| `firstObservedOn` | Triangle Startups' reported first-seen date; null for 5 rows. |
| `fetchedOn` | Last source-check date reported in the public response; null for 8 rows. It is not this download's capture time. |
| `listedOn` | The date labeled “listed” by the public roster, retained separately from established first-seen/publication dates. |

The site reported source data within three days for 36 of 37 official boards. Pluto Health's board was unavailable. Its absence from this snapshot does not establish that it has no open jobs. Retained listings and undated records may have changed; the capture is not an employer-by-employer verification run.

## Shared URLs need review

There are **279 distinct exact employer/posting-URL pairs**, with seven pairs shared across multiple titles. These involve Pairwise, SenterME, Upswing, Cloneable, GTM Buddy, CareYaya and MAA Laboratories. Many point to general careers pages, so a shared URL does not prove the roles are duplicates. All 298 rows are preserved.

The archived comparator groups by employer and normalized source URL. Explain these cases as identity limitations rather than claiming a job-level coverage rate from grouped URLs. Keep roster-row counts, source-link groups and confirmed missing jobs separate. Any matching-rule change belongs in a separately explained review decision.
