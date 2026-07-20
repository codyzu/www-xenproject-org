# Astro Migration

## Current State

The migration is complete. Astro is the only local and production static-site
generator, and `npm run build` writes the complete artifact to `dist/`.

The active source layout is:

- `src/pages` for routes.
- `src/components` for Astro and React components.
- `src/content` for content collections.
- `public` for URL-stable static source assets copied into the generated
  artifact.
- `src/styles/theme` for the carried-forward Sass styles.
- `data/navigation.yaml` and `data/redirects.yaml` for shared navigation and
  redirect data.
- `scripts/astro/check-public-artifact.js` for the static artifact contract.

## Completed Phases

- Phase 1 introduced Astro alongside the previous build.
- Phase 2 moved React islands into Astro-owned source.
- Phase 3 rebuilt the shared shell, navigation, metadata, redirects, and Ghost
  header/footer fragment.
- Phase 4 created Astro equivalents for the common page sections and cards.
- Phase 5 migrated low-risk static routes.
- Phase 6 migrated data-driven routes.
- Phase 7 flipped local, beta, and production builds to Astro.
- Phase 8 removed the retired Hugo/Vite rollback stack, Backstop visual tests,
  and Storybook.

## Verification

Use these checks for the complete artifact:

```sh
npm run build
npm run astro:check
npm run lint
npm run test:astro:links
```

Use `npm run test:astro:smoke:public` for screenshot and navigation smoke
testing against `dist/`. The Playwright config starts `serve dist`
automatically on `http://127.0.0.1:4321`.

## Ghost Header/Footer Contract

The Ghost blog consumes `/headerfooter.html` as the stable integration boundary
for the main site shell. Astro owns the header/footer markup and the
`#block-assets` contents; the Ghost theme should fetch that fragment, inject
`#block-assets` into the document head, and inject `#block-header` and
`#block-footer` into the page.

The fragment must stay wrapper-free, without top-level `<html>` or `<body>`
elements. `#block-assets` should point to cache-busted Astro assets such as
`/_astro/LegacyLayout.*.css` and `/_astro/blog-shell.*.js`.

The current implementation uses an Astro post-build hook to discover the
generated LegacyLayout CSS, build a small blog shell script from the menu scripts,
and write those URLs into `/headerfooter.html`. Keep
`scripts/astro/check-public-artifact.js` as the acceptance contract for this
boundary.

## Deferred Follow-Ups

- Replace the current Latest News client script with a declarative React island
  while preserving the Ghost Content API contract, loading and failure states,
  card metadata, keyboard-accessible carousel controls, and responsive layout.
- Consolidate the project and news carousel behavior once the React island owns
  Latest News.
- Review the RSS feed scope in `src/pages/index.xml.ts`. It currently includes
  past events and research papers; decide whether other migrated content should
  be included as well.
- Make download updates deterministic by replacing live deploy/test refreshes
  with a scheduled or manually triggered update job that commits regenerated
  JSON and reviewed snapshots through a merge request.
