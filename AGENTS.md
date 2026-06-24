# Agent Notes

This repo uses Astro as its static-site generator.

## Site Rules

- `npm run build` must produce the complete Astro artifact in `public/`.
- Preserve existing public URLs.
- Prefer shared data sources over duplicating configuration.
- Navigation data lives in `data/navigation.yaml`, with
  `src/data/navigation.ts` acting as the typed and schema-validated Astro
  adapter.
- Alias and redirect data lives in `data/redirects.yaml`, with
  `src/data/redirects.ts` providing validation and deriving redirect ownership
  from the migrated content routes. Do not duplicate redirect sources in the
  content route allowlist.
- `SITE_URL` controls absolute canonical, redirect, social, and RSS URLs. It
  defaults to `https://beta.xenproject.org`.

## Relevant Docs

- Read `docs/redesign-strategy.md` before redesign, homepage, component-system,
  layout, or visual-direction work. It documents the long-term direction for
  the Astro-era site and the intended legacy/new component boundary.
- Read `docs/migration/astro.md` before changing build architecture, layouts,
  Astro routes, migrated components, redirects, Ghost header/footer output, or
  the public artifact contract.
- Use `docs/downloads.md` when working on downloads data or download refresh
  scripts.
- Use `docs/images.md` when selecting existing image assets.
- Use `docs/small-components.md` when updating editor-facing component usage
  guidance.
- `docs/readme.md` is the top-level index for maintainer and migration docs.

## Astro Page Choices

- Use `.astro` for structured UI pages, data-driven pages, and card/grid
  layouts.
- Use `.mdx` for prose-heavy content where authors should edit Markdown-like
  text naturally.
- Keep structured pages in `.astro` and prose-heavy pages in `.mdx` unless a
  route has a concrete reason to change formats.

## Verification

Before committing Astro work, run the relevant checks:

```sh
npm run build
npm run astro:check
npm run lint
npm run test:astro:links
```

For visual smoke testing:

```sh
npm run build
npm run test:astro:smoke:public
```

`test:astro:smoke:public` starts `serve public` through Playwright's `webServer`
configuration on `http://127.0.0.1:4321`. Stop any other local server on that
port before running the public smoke test.

Known acceptable noise:

- `npm run build` may print Sass deprecation warnings from the existing
  styles.
- `npm run lint` may print the existing TODO / unused eslint-disable warnings.
