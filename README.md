# Xen Project Website

The Xen Project website is a static [Astro](https://astro.build/) site. Astro
owns every page and writes the deployable artifact to `dist/`.

## Get started

Requirements: Node.js 24 LTS (see `.nvmrc`) and npm.

```sh
npm install
npm run dev
```

Open <http://localhost:4321/>. Set `SITE_URL` only when generated absolute URLs
should use an origin other than `https://beta.xenproject.org`.

## Before opening a merge request

```sh
npm run check
npm run build
npm run check:dist
```

Use `npm run test:e2e` for the self-contained browser suite. It creates one
deterministic test artifact, validates it, and runs all Playwright tests.
Focused `test:e2e:*` commands reuse the existing `dist/` artifact.

## Contributing

- [Add a page](docs/adding-pages.md)
- [Browse maintainer documentation](docs/README.md)
- [Understand the site architecture](docs/architecture.md)
- [Use the design system](docs/design-system.md)

Public URLs are stable. Put static URL-addressable files in `public/`, add
redirects in `data/redirects.yaml`, and preserve existing routes.
