# Agent Notes

This repo uses Astro as its primary static-site generator. Hugo/Vite remains
temporarily available through explicit legacy rollback commands until Phase 8.

## Migration Rules

- `npm run build` must produce the complete Astro artifact in `public/`.
- Keep `npm run dev:legacy` and `npm run build:legacy` working until Phase 8.
- Do not remove Hugo layouts, content, shortcodes, or Vite entry points before
  Phase 8 unless explicitly requested.
- Preserve existing public URLs.
- Prefer shared data sources over duplicating Hugo and Astro configuration.
- Navigation data for migrated Astro pages lives in `data/navigation.yaml`, with
  `src/data/navigation.ts` acting as the typed and schema-validated Astro adapter.
- Alias and redirect data lives in `data/redirects.yaml`, with
  `src/data/redirects.ts` providing validation and deriving redirect ownership
  from the migrated content routes. Do not duplicate redirect sources in the
  content route allowlist.
- `SITE_URL` controls absolute canonical, redirect, social, and RSS URLs. It
  defaults to `https://beta.xenproject.org`.

## Astro Page Choices

- Use `.astro` for structured UI pages, data-driven pages, card/grid layouts,
  and pages replacing shortcode-heavy Hugo layouts.
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
  theme styles.
- `npm run lint` may print the existing TODO / unused eslint-disable warnings.
