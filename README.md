# Xen-Project website

## Quick start

### Prerequisites

- Node.js (includes npm), see [.nvmrc](/.nvmrc) for version

### Install

- git clone to your local system
- `npm install`

### Development

1. `npm run dev`
2. navigate to [http://localhost:1313/](http://localhost:1313/)

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
  