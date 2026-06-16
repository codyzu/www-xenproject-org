# Xen-Project website

## Quick start

### Prerequisites

- Node.js 24 LTS (includes npm), see [.nvmrc](/.nvmrc) for the exact version

### Install

1. git clone to your local system
1. `npm install`

### Development

1. `npm run dev`
2. navigate to the Vite proxy at [http://localhost:5173/](http://localhost:5173/)

Hugo's livereload is disabled in development because the browser-facing server is Vite on port `5173`. Vite handles page reloads, while Hugo stays bound to `localhost:1313` behind the proxy.

### Astro migration spike

The Astro migration spike keeps Hugo/Vite as the main production build, then overlays allowlisted Astro routes into `public/`.
The current migrated route allowlist lives in [`scripts/astro/migrated-routes.ts`](scripts/astro/migrated-routes.ts).

To build the integrated spike artifact:

1. `npm run build:astro-spike`
1. output is written to `/public`

That command runs the existing Hugo/Vite production build, builds Astro into `dist-astro/`, then copies only migrated Astro routes and generated Astro assets into `public/`.

To run the visual smoke test against the integrated artifact:

1. make sure nothing else is running on `127.0.0.1:4321`
1. `npm run test:astro:smoke:public`

Playwright starts `serve public` on `http://127.0.0.1:4321`, snapshots migrated routes such as `/about/contact-us/`, `/contribute/code-of-conduct/`, `/contribute/contribution-guidelines/`, `/more/xen-branding/`, and `/resources/matrix/`, and compares them to the checked-in Hugo baselines.
The same suite also runs navigation smoke tests that open desktop and mobile menus and verify first-level menu links.
It also snapshots high-value Hugo-owned pages so the Astro overlay can be checked against the wider production shell.

To check generated internal links, local assets, canonical URLs, redirect targets, and 404 output:

1. `npm run build:astro-spike`
1. `npm run test:astro:links`

### CI Runtime

GitLab CI uses `node:24.16.0-bookworm` so Node matches the local runtime contract.
Hugo is provided by the repo's `hugo-extended` npm dependency and invoked through npm scripts.

To regenerate the Hugo/Vite baseline screenshot, run the dev server first:

1. `npm run dev`
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

Running in dev mode, `npm run dev`, uses the vite dev server and proxies all requests not served by vite to hugo.

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
  
