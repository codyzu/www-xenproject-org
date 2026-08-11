# Xen Project Website

## Quick Start

### Prerequisites

- Node.js 24 LTS, see [.nvmrc](/.nvmrc) for the exact version.

### Install

1. Clone the repository.
2. Run `npm install`.

### Development

1. Run `npm run dev`.
2. Open [http://localhost:4321/](http://localhost:4321/).

Set `SITE_URL` when generated absolute URLs should use an origin other than
`https://beta.xenproject.org`.

## Production Build

Astro is the only site generator. It writes the complete static artifact to
`dist/`, and `public/` contains URL-stable static source assets. The route
inventory lives in
[`scripts/astro/content-routes.ts`](scripts/astro/content-routes.ts), and
aliases and redirects live in [`data/redirects.yaml`](data/redirects.yaml).

To build and validate the artifact:

1. `npm run build`
2. `npm run test:astro:links`

`npm run test:astro:standalone` performs a fresh build and enforces the route
inventory, RSS, `headerfooter.html`, redirects, assets, canonicals, and 404
contract.

To serve a built artifact locally:

1. `npm run build`
2. `npm run serve`
3. Open [http://localhost:4321](http://localhost:4321), or use the network URL
   printed by Astro from another device on the same network.

## Tests

Run the main checks before merging:

```sh
npm run build
npm run astro:check
npm run lint
npm run test:astro:links
```

For visual smoke testing, make sure nothing else is running on
`127.0.0.1:4321`, then run:

```sh
npm run test:astro:smoke:public
```

The command first rebuilds `dist/` with the isolated, committed Ghost fixture.
Playwright then starts Astro's preview server, snapshots representative routes,
verifies navigation behavior, exercises React islands, and checks redirect metadata.

### Review Screenshots

Generate disposable full-page screenshots for visual review with:

```sh
# Homepage, Embedded & Automotive, Cloud & Infrastructure, and Safety
npm run screenshots

# One route from a temporary local Astro development server
npm run screenshots -- /technology/safety/

# One page from an existing deployment or server
npm run screenshots -- https://beta.xenproject.org/technology/safety/
```

With no argument, the command captures the four design-system review routes
named above. Each run writes desktop and mobile PNGs to a timestamped directory
under `screenshots/`. Desktop images are 1440 pixels wide, mobile images are
390 pixels wide, and both extend vertically to capture the full page. The
output is ignored by Git and is intended for attaching to Codex, ChatGPT, or
other review conversations rather than for committed visual-test baselines.

To validate a deployed beta artifact manually, run `npm run test:astro:staging`.
For a faster homepage guardrail check, run
`npm run test:astro:staging:homepage-guardrails`. The staging suite includes
the cache-backed homepage news checks. These commands do not start a local
server; deploy the commit under test first.

## Ghost Integration

Ghost content is fetched only by `npm run search:refresh`, using the server-side
`GHOST_CONTENT_API_URL` and `GHOST_CONTENT_API_KEY` values. Astro builds read
the resulting normalized cache for Pagefind and recent-post sections without a
browser request or public API configuration. Use `npm run search:fixture` to
prepare deterministic synthetic cache data when live credentials are not
available. `npm run dev` preserves an existing refreshed cache and seeds this
fixture only when the cache is missing. See [docs/search.md](./docs/search.md)
for the complete local and CI workflow.

## CI Runtime

GitLab CI uses `node:24.16.0-bookworm` so Node matches the local runtime
contract. Beta and production artifacts use the Astro build. The production
`publish` job runs only on the default branch and builds canonical, social,
redirect, and RSS URLs for `https://xenproject.org`.

## Documentation

Maintainer documentation lives in [docs](./docs).

## Tools

- [Astro](https://astro.build/)
- [Npm](https://www.npmjs.com)
- [Sass](https://sass-lang.com)
- [UnoCSS](https://unocss.dev/)
- [React](https://react.dev/)

## Other Resources

- [Figma Design](https://www.figma.com/design/36fAO6lf2tvY5G2KwOl6eu/xenproject.org?node-id=125-28209&m=dev)
- [SVGOMG](https://svgomg.net/)
- [Squoosh](https://squoosh.app/)
