# Weekly xen-devel digests

The `xenDevelDigests` collection owns “This week on xen-devel”. Issues live in
`src/content/xen-devel-digests/` as Markdown. Use the coverage end date as the
filename, for example `2026-11-12.md`, and retain it after publication so URLs
stay stable. Do not include a level-one heading in the body; the layout owns it.

```yaml
---
title: 'This week on xen-devel: 6 to 12 November 2026'
description: 'A short summary of the week’s development topics.'
coverageStart: '2026-11-06'
coverageEnd: '2026-11-12'
author: Bruno
draft: true
---
```

## Review and publish

Automation should generate Markdown with `draft: true` and open a review PR.
Check summaries against the linked public threads, including attribution,
technical claims, and whether changes are proposed, reviewed, or merged.
Remove the source’s “Draft, not yet checked” notice only after review.
Then set `draft: false`, add `reviewedBy` with the reviewer’s name, and set
`publishedAt` to the actual publication date (ISO 8601, UTC).
A non-draft issue without both fields fails schema validation.

Drafts have no generated route, sitemap entry, RSS item, search record, or
latest-issue placement, even in development. Future-dated publications are
also excluded until a build on or after `publishedAt`. Publication needs a
rebuild; there is no runtime scheduler. Review drafts in Markdown or a PR.
To evaluate the published design locally, use a temporary synthetic issue
with a past publication date and reviewer, then remove it before committing.

## Site integration

The archive is `/community/xen-devel-digest/`, with a dedicated feed at
`/community/xen-devel-digest/rss.xml`. Published issues are sorted by coverage
end date and rendered with `LongformLayout`; previous/next links only include
published issues. `src/data/xen-devel-digests.ts` supplies the shared selection
used by routes, RSS, and latest-issue placements. `SITE_URL` supplies canonical
and feed origins through Astro’s configured site.

Community always links to the archive. The homepage shows a separate development
update only when an issue is published; Ghost news selection stays independent.
Both navigation systems, contributor guidance, and mailing-list resources link
to the archive. Pagefind indexes generated issue HTML through the normal build,
so draft bodies never enter the public index. New issues need no manual route
inventory entry; register only the archive in `redesignRoutes`.

Run `npm run check`, `npm run build`, `npm run check:dist`, and
`npm run test:e2e` before review. Run `npm run test:digests` for the isolated
publication build test (synthetic reviewed, draft, and future-dated issues).
It cleans up its temporary entries and output; run it separately from other
Astro builds because content syncing uses a shared local cache.
