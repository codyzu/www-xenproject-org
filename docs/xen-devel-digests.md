# Weekly xen-devel digests

The `xenDevelDigests` collection owns “This week on xen-devel”. Issues live in
`src/content/xen-devel-digests/` as Markdown. Use the coverage end date as the
filename, for example `2026-11-12.md`, and retain it after publication so URLs
stay stable. Do not include a level-one heading in the body; the layout owns it.
Use a concise, topic-led `description`: it appears in archive rows, latest-issue
placements, RSS, and page metadata. Avoid repeating the series name or dates.

```yaml
---
title: 'This week on xen-devel: 6 to 12 November 2026'
description: 'APX, RISC-V interrupts, Arm CPU hotplug, and migration fixes.'
coverageStart: '2026-11-06'
coverageEnd: '2026-11-12'
author: Bruno
---
```

## Review and publish

Automation should generate Markdown on a branch and open a review PR.
Every issue in the collection renders locally and in staging, including in the
archive, RSS, search, and latest-issue placements. There is no draft state,
reviewer gate, or date-based scheduling. Review and merge are the publication
boundary: merge only content ready for production, since the staging artifact
can be promoted unchanged to production.

Check summaries against the linked public threads, including attribution,
technical claims, and whether changes are proposed, reviewed, or merged.
The imported issues retain their original unchecked-content notices; remove
those notices only after review and before merging. `reviewedBy` and
`publishedAt` are optional descriptive metadata, not visibility controls.
If `publishedAt` is omitted, RSS uses the coverage end date. A future value
also does not hide the issue or schedule publication.

## Site integration

The archive is `/community/xen-devel-digest/`, with a dedicated feed at
`/community/xen-devel-digest/rss.xml`. Issues are sorted by coverage
end date and rendered with `LongformLayout`; previous/next links connect
adjacent issues. `src/data/xen-devel-digests.ts` supplies the shared collection
used by routes, RSS, and latest-issue placements. `SITE_URL` supplies canonical
and feed origins through Astro’s configured site.

Community always links to the archive. The homepage shows a separate development
update when the collection contains an issue; Ghost news selection stays independent.
Both navigation systems, contributor guidance, and mailing-list resources link
to the archive. Pagefind indexes generated issue HTML through the normal build,
so every issue is searchable after building. The artifact route inventory
derives issue URLs from the collection filenames; new issues need no manual
route inventory entry. The archive uses the coverage end date as its ISO date
label, with the full coverage range below the topic summary. It is a single
chronological list, with only the newest issue marked “Latest”.

Run `npm run check`, `npm run test:digests`, and `npm run check:dist` before
review. `test:digests` builds the deterministic fixture artifact and verifies
issue routes, order, metadata, navigation, RSS, sitemap, and latest placements.
Use `npm run test:e2e` for the full browser suite.
