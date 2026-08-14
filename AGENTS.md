# Agent Notes

This repo uses Astro as its static-site generator.

## Site Rules

- `npm run build` must produce the complete Astro artifact in `dist/`.
- `public/` contains URL-stable static source assets that Astro copies into the
  generated artifact.
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

- Read `docs/design-system.md` before redesign, homepage, component-system,
  layout, or visual-direction work. Prefer composing existing blocks before
  adding one and prefer page-local composition before adding a primitive.
- Read `docs/architecture.md` before changing build architecture, layouts,
  Astro routes, migrated components, redirects, Ghost header/footer output, or
  the public artifact contract.
- Read `docs/adding-pages.md` before adding a route or changing shared
  navigation. New-shell navigation lives in `data/navigation-v2.yaml`; legacy
  and Ghost navigation lives in `data/navigation.yaml` during the migration.
- Use `docs/downloads.md` when working on downloads data or download refresh
  scripts.
- Use `docs/images.md` when selecting existing image assets.
- `docs/README.md` is the top-level maintainer documentation index.

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
npm run check
npm run build
npm run check:dist
```

For visual smoke testing:

```sh
npm run test:e2e
```

`test:e2e` builds a deterministic fixture artifact once, validates it, and
runs the full browser suite. Focused `test:e2e:*` commands reuse an existing
`dist/` artifact. Playwright starts `astro preview` through its `webServer`
configuration on `http://127.0.0.1:4321`. Stop any other local server on that
port before running browser tests.

Known acceptable noise:

- `npm run build` may print Sass deprecation warnings from the existing
  styles.
- `npm run check` may print the existing TODO / unused eslint-disable warnings.
