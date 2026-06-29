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
`public/`. The route inventory lives in
[`scripts/astro/migrated-routes.ts`](scripts/astro/migrated-routes.ts), and
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
3. Open [http://localhost:3000](http://localhost:3000).

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

Playwright starts `serve public`, snapshots representative routes, verifies
navigation behavior, exercises React islands, and checks redirect metadata.

To validate a deployed beta artifact manually, run `npm run test:astro:staging`.
For a faster homepage guardrail check, run
`npm run test:astro:staging:homepage-guardrails`. Run
`npm run test:astro:staging:ghost` for the focused, unmocked production Ghost
integration check. These commands do not start a local server; deploy the commit
under test first.

## Ghost Integration

Ghost configuration is selected by the checked-in mode files. Development uses
`.env.development` and the local mock endpoint. Production-mode builds use
`.env.production` and the public production Ghost Content API. Ignored
mode-local files such as `.env.development.local`, or shell environment
variables, can override these values when live Ghost behavior is needed during
local debugging.

`npm run test:astro:dev:ghost` starts an isolated development server and
verifies the checked-in mock configuration.

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
