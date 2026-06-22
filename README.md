# Xen-Project website

## Quick start

### Prerequisites

- Node.js 24 LTS (includes npm), see [.nvmrc](/.nvmrc) for the exact version

### Install

1. git clone to your local system
1. `npm install`

### Development

1. `npm run dev`
2. navigate to Astro at [http://localhost:4321/](http://localhost:4321/)

Set `SITE_URL` when generated absolute URLs should use an origin other than
`https://beta.xenproject.org`.

### Astro production build

Astro is the primary site generator and writes the complete artifact to `public/`.
The route inventory lives in [`scripts/astro/migrated-routes.ts`](scripts/astro/migrated-routes.ts),
and aliases and redirects live in [`data/redirects.yaml`](data/redirects.yaml).

To build and validate the complete artifact:

1. `npm run build`
1. `npm run test:astro:links`

`npm run test:astro:standalone` performs a fresh build and enforces the exact
route inventory, RSS, `headerfooter.html`, redirects, assets, canonicals, and
Astro 404 contract.

To run the visual smoke test against the production artifact:

1. make sure nothing else is running on `127.0.0.1:4321`
1. `npm run test:astro:smoke:public`

Playwright starts `serve public` on `http://127.0.0.1:4321`, snapshots representative routes, and compares them to the checked-in Hugo baselines. The complete Astro route inventory lives in `scripts/astro/migrated-routes.ts`.
The same suite also runs navigation smoke tests that open desktop and mobile menus and verify first-level menu links.
It also exercises the direct React islands on the homepage, About, membership,
Get Started, and CI routes. Research and event routes verify the Astro-native
replacement for the legacy `IconButton` mount.
Redirect smoke coverage verifies the generated canonical, refresh, and
`noindex` metadata.

To validate the deployed beta artifact manually, run `npm run test:astro:staging`.
For a faster homepage Story check, run `npm run test:astro:staging:story`.
Run `npm run test:astro:staging:ghost` for the focused, unmocked production
Ghost integration check. Ordinary local and Playwright development uses the
checked-in Ghost fixture; `npm run dev` does not depend on the production blog.
These commands do not start a local server; deploy the commit under test first.

Ghost configuration is selected by the checked-in mode files. Development uses
`.env.development` and the local mock endpoint. Production-mode builds use
`.env.production` and the public production Ghost Content API. Ignored
mode-local files such as `.env.development.local`, or shell environment
variables, can override these values when live Ghost behavior is needed during
local debugging. `npm run test:astro:dev:ghost` starts an isolated development
server and verifies the checked-in mock configuration.

### Legacy rollback

Hugo/Vite remains available temporarily through `npm run dev:legacy` and
`npm run build:legacy`. These commands are rollback paths only and will be
removed with the Hugo source during Phase 8.

### CI Runtime

GitLab CI uses `node:24.16.0-bookworm` so Node matches the local runtime contract.
Beta and production artifacts use the Astro build. The production `publish`
job runs only on the default branch and builds canonical, social, redirect, and
RSS URLs for `https://xenproject.org`.

To regenerate the Hugo/Vite Story reference screenshots without overwriting
the active Astro snapshots, run the dev server first:

1. `npm run dev:legacy`
1. In another terminal, `npm run test:astro:smoke:hugo-baseline`

The baseline command points Playwright at Vite's dev proxy on `http://127.0.0.1:5173` and updates the screenshot snapshot.

### Production Build

1. `npm run build`
1. builds production artifacts in `/public`
1. `npm run serve`
1. navigate to [http://localhost:3000](http://localhost:3000)

## Main documentation

_💡 Note: These docs are mostly about working with a hugo site and the hugo resources (shortcodes and partials) included in this site._

All the main documentation is in the [docs](./docs) folder.


## Tools

- [Hugo](https://gohugo.io)
- [Npm](https://www.npmjs.com)
- [Sass](https://sass-lang.com)

### React

_💡 Note: a new layer of JS tooling was added as part of a 2025 modernization._

- Recent additions to the site are built with [react](https://react.dev/).
- [vite](https://vite.dev/) is used to package the react javascript resources and build the tailwind style CSS.
- [uno-css](https://unocss.dev/) is used to add tailwind style CSS classes. Uno is configured to only recognize classnames prefixed with `uno-`. As configured in [uno.config.ts](/uno.config.ts), uno is configured with the [tailwind 3 preset](https://unocss.dev/presets/wind3) and the [icons preset](https://unocss.dev/presets/icons). CSS icons are prefixed with `i-`.

The legacy development command uses Vite as a browser-facing proxy to Hugo.

## Important urls

- [Hugo Documentation](https://gohugo.io/getting-started/directory-structure/)
- [Npm Package Hugo Extended](https://www.npmjs.com/package/hugo-extended)
- [Figma Design](https://www.figma.com/design/36fAO6lf2tvY5G2KwOl6eu/xenproject.org?node-id=125-28209&m=dev)


## Other resources

### Edit SVG : 
 - https://editsvg.online/editor.html (copy past the SVG code and edit, and then copy the code)
 - https://svgomg.net/ (copy past the SVG code, optimize it, and copy the code)

### Image Tools

- [Sqoosh](https://squoosh.app/) Convert and reduce image size
  
