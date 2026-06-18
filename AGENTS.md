# Agent Notes

This repo is currently a Hugo static site with a Vite/React asset pipeline. The
`astro-spike` branch introduces Astro as a sibling build so pages can be migrated
incrementally.

## Migration Rules

- Keep the existing Hugo/Vite production path working unless the task explicitly
  changes that contract.
- Astro is currently additive and builds to `dist-astro/`.
- Do not remove Hugo layouts, content, shortcodes, or Vite entry points during
  spike work unless explicitly requested.
- Migrate pages route-by-route and preserve existing URLs.
- Prefer shared data sources over duplicating Hugo and Astro configuration.
- Navigation data for migrated Astro pages lives in `data/navigation.yaml`, with
  `src/data/navigation.ts` acting as the typed and schema-validated Astro adapter.
- Alias and redirect data lives in `data/redirects.yaml`, with
  `src/data/redirects.ts` providing validation and deriving redirect ownership
  from the migrated content routes. Do not duplicate redirect sources in the
  content route allowlist.
- During the spike, integrated output is built with `npm run build:astro-spike`.
  It runs the existing Hugo/Vite production build, runs Astro, then overlays only
  allowlisted migrated routes from `dist-astro/` into `public/`.

## Astro Page Choices

- Use `.astro` for structured UI pages, data-driven pages, card/grid layouts,
  and pages replacing shortcode-heavy Hugo layouts.
- Use `.mdx` for prose-heavy content where authors should edit Markdown-like
  text naturally.
- Keep `/about/contact-us/` as the initial structured `.astro` example.
- A good next MDX candidate is `/contribute/code-of-conduct/` or
  `/contribute/contribution-guidelines/`.

## Verification

Before committing Astro spike work, run the relevant checks:

```sh
npm run build
npm run build:astro-spike
npm run astro:build
npm run astro:check
npm run lint
```

For visual smoke testing:

```sh
npm run build:astro-spike
npm run test:astro:smoke:public
```

`test:astro:smoke:public` starts `serve public` through Playwright's `webServer`
configuration on `http://127.0.0.1:4321`. Stop any other local server on that
port before running the public smoke test.

Known acceptable noise:

- `npm run build` may print the existing Hugo raw HTML warning.
- `npm run astro:build` may print Sass deprecation warnings from the existing
  theme styles.
- `npm run lint` may print the existing TODO / unused eslint-disable warnings.
