# Astro Migration Plan

## Current State

The site is currently a Hugo static site with Vite bolted on for React islands and UnoCSS:

- Hugo owns routing, content rendering, menus, layouts, shortcodes, data files, RSS, aliases, and production output in `public/`.
- Vite owns the React/TypeScript bundle at `themes/xen-project/assets/js/vite/bundle-main.tsx`.
- Vite writes built assets into `themes/xen-project/static`, and Hugo later copies those into `public/`.
- Development runs both servers: Vite on `5173`, Hugo on `1313`, with Vite proxying most requests to Hugo.
- Production runs `npm run vite:build` first, then `npm run hugo:build`.

This is exactly the kind of split Astro can simplify: Astro already uses Vite internally, supports static output, can render Markdown/MDX content, and has first-class partial hydration for React islands.

## Migration Difficulty

Overall difficulty: **medium**.

The repo is not huge, but the content is tightly coupled to Hugo shortcodes.

Important size markers from this repo:

- About 40 Markdown content files under `content/`.
- About 4,900 lines of Markdown content.
- About 1,800 lines of Hugo templates, partials, and shortcodes.
- A small React island surface under `themes/xen-project/assets/js/vite`.
- A relatively concentrated shortcode vocabulary:
  - `section`, `md`, `media-block`, `row-from-list`, `div`, `col`, `row`
  - smaller one-offs like `features-list`, `vertical-lists`, `pricing`, `research-papers`, `get-downloads-links`, diagrams, videos, and embeds

The migration is very feasible if it is done route-by-route. A big-bang rewrite would be risky mostly because Hugo shortcode syntax is embedded throughout the Markdown.

## Recommended Strategy

Use Astro as a sibling build first, not as an immediate replacement.

Add an `astro/` or `src/` Astro app that can build selected routes into the same final `public/` artifact while Hugo continues to own the rest. Once enough routes are migrated, flip the default so Astro owns the site and Hugo is only used for remaining legacy pages, then remove Hugo.

The key rule: **every phase should produce a deployable site**.

## Current Progress

Completed on the `astro-spike` branch:

- Added Astro as an additive sibling build.
- Added Astro scripts for dev, build, preview, and type checking.
- Added Playwright visual smoke coverage for `/about/contact-us/`.
- Captured the Hugo/Vite screenshot baseline and removed the old debug toolbar
  before stabilizing the baseline.
- Ported the shared page shell to Astro:
  - base layout
  - head metadata
  - header
  - footer
  - recursive menu rendering
  - socials
  - card component
- Added a reusable MDX content layout with resource aside support.
- Migrated `/about/contact-us/` as the first Astro route.
- Migrated `/contribute/code-of-conduct/` and
  `/contribute/contribution-guidelines/` as MDX content routes.
- Migrated `/resources/matrix/` as an MDX content route.
- Added neutral YAML navigation data at `data/navigation.yaml`.
- Added schema validation for navigation data in `src/data/navigation.ts`.
- Removed the draft template page from neutral navigation so Astro output
  matches Hugo production menus.
- Added an allowlisted overlay script so `npm run build:astro-spike` builds the
  Hugo/Vite site first, builds Astro second, then copies only migrated Astro
  routes into `public/`.
- Added `npm run test:astro:smoke:public`, which starts `serve public` through
  Playwright and runs the screenshot smoke test against the integrated artifact.
- Documented the spike workflow in `README.md` and agent guardrails in
  `AGENTS.md`.

Partially complete:

- Phase 0 guardrails are started with a screenshot baseline and a repeatable
  smoke test, but there is not yet a broad link checker or visual smoke list for
  the highest-value pages.
- Phase 3 is started with the shared shell, metadata, and resource aside
  rendering, but RSS and full Hugo metadata parity still need work.
- Phase 5 is started with `/about/contact-us/`,
  `/contribute/code-of-conduct/`, `/contribute/contribution-guidelines/`, and
  `/resources/matrix/`, but more low-risk pages still need to move before this
  is a repeatable migration lane.

Not started:

- React island migration.
- Common shortcode/component library beyond `Card.astro` and the prose-content
  MDX layout.
- Data-driven Astro sections.
- Astro ownership flip.
- Hugo removal.

## Phase 0: Baseline And Guardrails

Goal: make sure migration work can be compared safely.

Tasks:

- Capture a production build snapshot from the current Hugo/Vite pipeline.
- Add a link checker or crawler against `public/` for internal links, assets, canonical URLs, redirects, and 404 behavior.
- Add a visual smoke-test list for the highest-value pages:
  - `/`
  - `/about/`
  - `/projects/all-projects/`
  - `/projects/hypervisor/`
  - `/resources/downloads/`
  - `/resources/summit-2026/`
  - `/resources/past-events/`
  - `/research/`
  - `/contribute/ci/`
- Document the expected output paths for aliases and redirects.

Acceptance criteria:

- Existing `npm run build` still passes.
- There is a repeatable way to compare current output against migrated output.

## Phase 1: Introduce Astro Without Changing Production Pages

Goal: prove Astro can live in the repo without disturbing the current site.

Tasks:

- Add Astro and minimal config for `output: "static"`.
- Keep existing Vite config temporarily for Hugo.
- Add scripts such as:
  - `astro:dev`
  - `astro:build`
  - `astro:check`
- Configure Astro to use the same public assets from `static/`.
- Bring over global CSS entry points from `themes/xen-project/assets/css/main.scss`.
- Configure UnoCSS for Astro using the existing `uno.config.ts`.
- Add a throwaway internal route such as `/astro-healthcheck/`.

Acceptance criteria:

- Astro builds a static page.
- Hugo/Vite build still works unchanged.
- No production route is replaced yet.

## Phase 2: Move The React Islands To Astro

Goal: remove the custom Vite/Hugo asset handshake.

Current React island mount points:

- `#ci-status`
- `#hardware-grid`
- `#logo-wheel`
- `#xen-story`
- `#cookie-banner`
- `div[data-component="IconButton"]`

Tasks:

- Move `themes/xen-project/assets/js/vite/components` to an Astro-owned source folder, for example `src/components/react`.
- Convert manual `createRoot(...)` hydration to Astro islands:
  - `<CiStatus client:load />`
  - `<HardwareGrid client:visible />`
  - `<LogoWheel client:visible />`
  - `<CookieBanner client:idle />`
- Replace shortcode-generated `div[data-component="IconButton"]` with an Astro component.
- Keep the old Vite bundle only for Hugo-rendered pages until those pages are migrated.

Acceptance criteria:

- One Astro route renders the same React components without `bundle-main.tsx`.
- Hugo pages still use the old bundle during the transition.

## Phase 3: Port Layout, Header, Footer, And Metadata

Goal: recreate the shared page shell in Astro.

Tasks:

- Create Astro equivalents for:
  - `baseof.html`
  - `partials/head.html`
  - `partials/header.html`
  - `partials/footer.html`
  - `partials/menu.html`
  - `partials/socials.html`
  - `partials/aside.html`
- Move `hugo.yaml` menu data into a neutral data file, likely `src/data/navigation.ts` or `src/data/navigation.yaml`.
- Recreate metadata behavior:
  - title format
  - description fallback
  - canonical URL
  - Open Graph image fallback
  - Twitter card tags
  - robots tags
- Recreate RSS only once Astro owns content sections that need feeds.

Acceptance criteria:

- A static Astro page has the same header, footer, social links, metadata, and global styles as Hugo.

## Phase 4: Create Astro Components For Common Shortcodes

Goal: stop carrying shortcode syntax into newly migrated pages.

Build Astro components for the common Hugo shortcodes:

- `Section.astro`
- `MarkdownBlock.astro` or MDX-native content blocks
- `MediaBlock.astro`
- `Row.astro`
- `Col.astro`
- `Card.astro`
- `FeatureList.astro`
- `VerticalLists.astro`
- `Carousel.astro`
- `FullWidthImage.astro`
- `IconButton.astro`
- `VideoPlayer.astro`
- `YouTube.astro`
- `EventHero.astro`

Recommendation: do not try to emulate Hugo shortcode syntax inside Astro. Convert pages to MDX or Astro pages as they move. That makes the target architecture clean instead of preserving the accidental complexity.

Acceptance criteria:

- The homepage can be rebuilt in Astro using real components instead of Hugo shortcode strings.

## Phase 5: Migrate Low-Risk Static Pages

Goal: migrate pages that do not depend heavily on Hugo data APIs.

Good first candidates:

- `/about/contact-us/` **Done as `.astro`.**
- `/more/xen-branding/` **Done as `.mdx`.**
- `/resources/matrix/` **Done as `.mdx`.**
- `/contribute/code-of-conduct/` **Done as `.mdx`.**
- `/contribute/contribution-guidelines/` **Done as `.mdx`.**
- `/projects/hvmi/`

Tasks:

- Convert each Markdown file with shortcodes into `.mdx` or `.astro`.
- Preserve route paths exactly.
- Preserve frontmatter fields needed for title, description, aliases, aside, page header visibility, and social images.
- Add redirects for aliases.

Acceptance criteria:

- Migrated routes match existing URLs.
- Existing Hugo routes continue to build for pages not migrated.
- Visual smoke tests pass for migrated pages.

## Phase 6: Migrate Data-Driven Sections

Goal: move Hugo data logic into Astro data utilities.

Sections to handle:

- Research pages:
  - Current data is generated by `scripts/research/parse-research-papers.js`.
  - Hugo reads `site.Data.research`.
  - Astro can import the generated JSON/YAML directly or use a content collection.
- Downloads:
  - Current data comes from `assets/data/downloads-latest.json`.
  - Astro can import JSON directly and render nested lists.
- Tickets/pricing:
  - Current data comes from `data/tickets-2025.yaml` and `data/tickets-2026.yaml`.
  - Astro can import YAML through a loader or convert these files to JSON/TS.
- Past events:
  - Current Hugo list sorts child pages by `eventEnd`.
  - Astro content collections can sort by frontmatter.

Acceptance criteria:

- `/research/`, individual research paper routes, `/resources/downloads/`, `/resources/past-events/`, and pricing blocks render from Astro data.
- Existing scripts are either reused or replaced with simpler Astro-native imports.

## Phase 7: Flip Ownership To Astro

Goal: make Astro the primary static site generator.

Tasks:

- Change `npm run dev` to Astro dev.
- Change `npm run build` to Astro build plus any remaining legacy compatibility step.
- Remove the Vite proxy setup once Hugo is no longer serving primary pages.
- Stop writing Vite output into `themes/xen-project/static`.
- Update GitLab CI image if Hugo is no longer required.
- Keep `scripts/downloads/getLinks.js` and `scripts/research/parse-research-papers.js` if still useful.

Acceptance criteria:

- `npm run build` produces the production `public/` directory using Astro.
- CI no longer needs a Hugo-specific image unless there are remaining legacy pages.

## Phase 8: Remove Hugo

Goal: delete the old stack once no routes depend on it.

Tasks:

- Remove `hugo.yaml`, `hugo.dev.yaml`, `layouts/`, and `themes/xen-project/layouts`.
- Move any reusable static assets out of `themes/xen-project/static`.
- Move CSS from `themes/xen-project/assets/css` into Astro source structure.
- Remove `hugo-extended`, Hugo scripts, Hugo docs, and Hugo-specific CI settings.
- Delete `bundle-main.tsx` after all islands are Astro components.

Acceptance criteria:

- No Hugo commands are needed locally or in CI.
- No content files contain Hugo shortcode syntax.
- Route, metadata, and asset checks pass.

## Main Risks

- **Shortcodes embedded in Markdown:** this is the largest migration cost. Avoid building a full Hugo-shortcode compatibility layer unless the migration stalls.
- **Git-based last modified dates:** Hugo currently uses `enableGitInfo`. Astro will need an equivalent helper if last-updated dates remain important.
- **Aliases and redirects:** Hugo handles these naturally. Astro needs explicit redirect generation.
- **RSS and custom output formats:** Hugo has `HEADERFOOTER` and RSS configured. Confirm whether `headerfooter.html` is still needed before porting.
- **UnoCSS scanning:** the current Vite entry imports Markdown and layout files as raw strings so UnoCSS sees classes. Astro needs an explicit content scan configuration for `.astro`, `.mdx`, `.md`, `.tsx`, and any legacy content during transition.
- **Generated assets:** Vite currently writes built assets into the Hugo theme. Astro should own asset hashing directly once pages move.

## Completed First Implementation Spike

Build a tiny Astro sibling app that migrates exactly one route: `/about/contact-us/`.

Scope:

- Add Astro config and scripts. **Done.**
- Add shared layout, head, header, footer, and CSS import. **Done.**
- Add `ContactUs` page using Astro components for `Section`, `RowFromList`, and `Card`. **Done.**
- Build Astro into a temporary output directory such as `dist-astro/` to avoid changing the current production artifact. **Done.**
- Compare output visually and with a link check. **Partially done:** screenshot
  smoke testing is in place, but a broader link check has not been added.

This spike should answer the important practical questions without committing the whole repo to the migration.

Estimated effort: **1 to 2 focused days** for the spike, assuming no package installation or CI constraints. Full migration is likely **1 to 3 weeks** depending on how exact the visual parity needs to be and whether old shortcode-heavy pages are converted manually or redesigned as components.

## Spike Verification Status

Verified on 2026-06-15:

- `npm run build` passes for the existing Hugo/Vite production path.
- `npm run astro:build` passes and outputs Astro spike routes to `dist-astro/`.
- `npm run astro:check` passes with no diagnostics.
- `npm run build:astro-spike` passes and overlays the migrated Astro route into
  `public/`.
- `npm run test:astro:smoke:public` passes against the integrated `public/`
  artifact.

Current result:

- Astro can coexist with the existing Hugo/Vite pipeline without replacing production output.
- `/about/contact-us/`, `/contribute/code-of-conduct/`,
  `/contribute/contribution-guidelines/`, and `/resources/matrix/` are real
  migrated routes with
  screenshot smoke tests.
- The screenshot comparison is stable after removing the old debug toolbar from the Hugo baseline.
- The remaining build noise is Sass deprecation output from the existing theme styles, not a spike blocker.
- Hugo source pages remain in place during the spike so Hugo can continue to
  construct complete menus from `hugo.yaml` and content frontmatter.

## Navigation Data Status

Astro migrated pages now read navigation from `data/navigation.yaml` through the
typed adapter in `src/data/navigation.ts`. The adapter parses YAML with
`js-yaml` and validates the recursive menu structure with Zod, so malformed
navigation data fails during Astro checks/builds instead of rendering silently.

Hugo still uses `hugo.yaml` and page frontmatter for production menus. Keep that
in place until there is a concrete need to make Hugo consume the neutral
navigation file too.

## Integrated Output Strategy

During the spike, migrated pages keep their Hugo source files in place so Hugo
continues to construct complete menus from `hugo.yaml` and content frontmatter.
Astro owns the replacement page output only after Hugo has built the full site.

Use `npm run build:astro-spike` to build the integrated artifact:

1. `npm run build` generates the normal Hugo/Vite site in `public/`.
2. `npm run astro:build` generates migrated Astro routes in `dist-astro/`.
3. `scripts/astro/overlay-migrated-routes.js` copies only allowlisted migrated
   route directories, plus generated Astro assets, into `public/`.

This deliberately avoids a broad `dist-astro/*` copy. The overlay allowlist is
the temporary source of truth for which routes Astro replaces in the final spike
artifact.

Use `npm run test:astro:smoke:public` to run the screenshot smoke test against
the integrated `public/` artifact. The Playwright config starts `serve public`
automatically on `http://127.0.0.1:4321`. Stop any other local server on that
port before running the public smoke test.
