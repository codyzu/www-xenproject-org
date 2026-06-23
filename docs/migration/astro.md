# Astro Migration Plan

## Original State

The migration started from a Hugo static site with Vite bolted on for React islands and UnoCSS:

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
- Added `npm run test:astro:links`, which checks the integrated `public/`
  artifact for local internal links, local assets, canonical URLs, redirect
  targets, and the generated 404 page.
- Added shared navigation smoke coverage for desktop menu links, mobile menu
  drilldown, keyboard submenu open/close, active navigation state, and migrated
  route shell rendering.
- Added high-value visual smoke coverage for `/`, `/about/`,
  `/projects/all-projects/`, `/projects/hypervisor/`,
  `/resources/downloads/`, `/resources/summit-2026/`,
  `/resources/past-events/`, `/research/`, and `/contribute/ci/`.
- Added `scripts/astro/migrated-routes.ts` as the shared source of truth for
  Astro-owned routes during the spike.
- Added focused React island smoke coverage for the current island mount
  surfaces: `#ci-status`, `#hardware-grid`, `#logo-wheel`, `#xen-story`,
  `#cookie-banner`, and `div[data-component="IconButton"]`.
- Moved shared React components to `src/components/react`, moved supporting
  assets into domain folders under `src/assets/ci` and `src/assets/story`, and
  moved the cookie helper script to `src/scripts/cookie-consent`.
- Migrated all current island-bearing overlay routes to direct Astro ownership:
  `/`, `/about/`, `/about/become-a-member/`, `/contribute/get-started/`,
  `/contribute/ci/`, and `/contribute/ci/status/`.
- Replaced legacy `IconButton` mounts with Astro-native links on the research,
  CI overview, and Spring Meetup routes.
- Kept the Hugo `bundle-main.tsx` mounting path working as a fallback while the
  Hugo production path remains supported.
- Hardened parent-route overlays so copying an Astro `index.html` does not
  remove Hugo-owned child routes.
- Loaded the existing theme menu runtime from the Astro base layout so migrated
  pages exercise the same header menu behavior as Hugo pages.
- Updated local and GitLab CI runtime metadata to Node 24 LTS. GitLab CI now
  runs on `node:24.16.0-bookworm`; Hugo is provided by the repo's
  `hugo-extended` npm dependency instead of a Hugo-specific Docker image.
- Documented the spike workflow in `README.md` and agent guardrails in
  `AGENTS.md`.
- Completed Phase 3 for the additive spike: the shared shell, navigation,
  metadata fallbacks and overrides, resource aside rendering, and manifest-driven
  redirect pages are implemented. RSS remains intentionally Hugo-owned until
  Astro owns feed-bearing content sections.

Completed:

- Phase 5 now includes all low-risk static routes. The remaining About pages,
  individual project pages, nested Hypervisor OpenPGP keys page, and mailing
  lists page render directly from Astro components or MDX.
- Phase 6 now includes every data-driven route. Downloads consume validated
  checked-in JSON, past events render from an Astro content collection, and
  Summit pricing consumes validated shared YAML.
- Phase 7A makes Astro independently buildable as a complete useful artifact.
  The remaining user-facing routes, curated section indexes, 404 page, RSS,
  page inventory, and legacy header/footer fragment are Astro-owned and covered
  by a standalone artifact contract. Empty Hugo taxonomy shells are
  intentionally retired.

Partially complete:

- The shared component library now includes structured sections, media blocks,
  feature lists, grids, cards, external-link actions, CI diagrams, media embeds,
  the latest-news shell, recursive download lists, download search, event heroes,
  and ticket pricing in addition to prose layouts.
- Phase 7 has flipped the default local build and beta deployment to Astro.
  Production remains on the explicit legacy build until beta acceptance is
  confirmed.

Not started:

- Hugo removal.

## Phase 0: Baseline And Guardrails

Goal: make sure migration work can be compared safely.

Tasks:

- Capture a production build snapshot from the current Hugo/Vite pipeline. **Done.**
- Add a link checker or crawler against `public/` for internal links, assets, canonical URLs, redirects, and 404 behavior. **Done.**
- Keep the shared header navigation smoke test passing for desktop, mobile, and keyboard submenu behavior. **Done for first-level menus.**
- Add a visual smoke-test list for the highest-value pages:
  - `/` **Done.**
  - `/about/` **Done.**
  - `/projects/all-projects/` **Done.**
  - `/projects/hypervisor/` **Done.**
  - `/resources/downloads/` **Done.**
  - `/resources/summit-2026/` **Done.**
  - `/resources/past-events/` **Done.**
  - `/research/` **Done.**
  - `/contribute/ci/` **Done.**
- Document the expected output paths for aliases and redirects. **Done.**

Acceptance criteria:

- Existing `npm run build` still passes. **Done.**
- There is a repeatable way to compare current output against migrated output. **Done.**

### Alias And Redirect Inventory

Hugo currently handles two redirect-like behaviors:

- `aliases:` frontmatter generates Hugo alias pages.
- `layout: redirect` plus `redirect:` renders through
  `themes/xen-project/layouts/_default/redirect.html`.

Astro needs explicit parity for both when it owns the affected routes.

`data/redirects.yaml` is now the complete neutral inventory. Its validated
adapter preserves whether an entry originated as a Hugo frontmatter alias or a
standalone redirect page. Astro generates every entry in `dist-astro/`, while
the integrated overlay selects external redirects and local aliases whose
target content route has migrated. Redirect smoke tests import the manifest to
ensure every entry has coverage, but intentionally keep expected ownership and
destinations hardcoded so changes to production derivation cannot make the
acceptance test pass itself. Both Astro-owned and Hugo-owned routes are checked
for their expected redirect metadata.

| Type | Source route | Target |
| --- | --- | --- |
| Hugo alias | `/more/xen-server-branding/` | `/more/xen-branding/` |
| Hugo alias | `/resources/xen-summit-2026/` | `/resources/summit-2026/` |
| Hugo alias | `/resources/spring-meetup-2026/` | `/resources/past-events/spring-meetup-2026/` |
| Hugo alias | `/resources/spring-meetup/` | `/resources/past-events/spring-meetup-2026/` |
| Hugo alias | `/resources/xen-summit-2025/` | `/resources/past-events/xen-summit-2025/` |
| Custom redirect | `/projects/` | `/projects/all-projects` |
| Custom redirect | `/spring26/` | `https://docs.google.com/document/d/1ddsfCTaDHvBOCtFLMTgoGEzaQSdJdogfIGooHWFnLJQ/edit?usp=sharing` |

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
- ~~Add a throwaway internal route such as `/astro-healthcheck/`.~~
  Superseded by real migrated Astro routes; `/about/contact-us/`,
  `/contribute/code-of-conduct/`, `/contribute/contribution-guidelines/`,
  `/more/xen-branding/`, and `/resources/matrix/` now provide stronger
  coexistence proof than a disposable healthcheck page.

Acceptance criteria:

- Astro builds a static page.
- Hugo/Vite build still works unchanged.
- Astro route replacement remains allowlisted and additive during the spike.

## Phase 2: Move The React Islands To Astro

Goal: move the React island source into the Astro tree, prove the legacy
Hugo/Vite mounting path still works from that shared source, then migrate island
routes one at a time to direct Astro ownership.

Current React island mount points:

- `#ci-status`
- `#hardware-grid`
- `#logo-wheel`
- `#xen-story`
- `#cookie-banner`
- `div[data-component="IconButton"]`

Tasks:

- Move `themes/xen-project/assets/js/vite/components` to
  `src/components/react`. **Done.**
- Move supporting assets and scripts into domain-oriented shared locations:
  - CI assets: `src/assets/ci`. **Done.**
  - Homepage story assets: `src/assets/story`. **Done.**
  - Cookie consent helper: `src/scripts/cookie-consent`. **Done.**
- Keep `themes/xen-project/assets/js/vite/bundle-main.tsx` as the legacy Hugo
  mounting layer during the spike, but import components from
  `src/components/react`. **Done.**
- Add shallow Playwright smoke coverage for every current island mount surface
  before and after moving the source. **Done.**
- Migrate `/contribute/ci/status/` as the first direct Astro React island route.
  **Done.**
  - The page renders `<CiStatus client:only="react" />` inside `#ci-status`
    because the current CI dashboard dependency graph includes browser-only
    globe/Three code that is not safe to server render.
- Convert remaining manual `createRoot(...)` hydration to Astro islands as their
  owning routes move:
  - `<HardwareGrid client:visible />` on `/contribute/ci/`. **Done.**
  - `<LogoWheel client:visible />` on `/`, `/about/`,
    `/about/become-a-member/`, and `/contribute/get-started/`. **Done.**
  - `<Story client:only="react" />` on `/`. **Done.**
  - `<CookieBanner client:idle />` on `/about/become-a-member/`. **Done.**
- Replace shortcode-generated `div[data-component="IconButton"]` with an Astro
  component when `/research/` or another route using it moves to Astro. **Done
  for all currently migrated routes that used it.**
- Remove `bundle-main.tsx` only after the Hugo production fallback is retired.
  No allowlisted Astro route relies on it, but Hugo builds still do.

Acceptance criteria:

- Every currently allowlisted island-bearing route renders its islands directly
  without relying on `bundle-main.tsx`. **Done.**
- Hugo fallback pages still use the old bundle during the transition. **Done.**
- `tests/astro/react-islands.spec.ts` covers the migrated islands and native
  replacements in the integrated Hugo/Astro artifact. **Done.**
- The React source, assets, and helper scripts no longer live under the Hugo
  theme Vite source tree. **Done.**
- Remaining island-bearing routes can be migrated one at a time without moving
  source again.

## Phase 3: Port Layout, Header, Footer, And Metadata

Goal: recreate the shared page shell in Astro.

Tasks:

- Create Astro equivalents for:
  - `baseof.html` **Done.**
  - `partials/head.html` **Done.**
  - `partials/header.html` **Done.**
  - `partials/footer.html` **Done.**
  - `partials/menu.html` **Done.**
  - `partials/socials.html` **Done.**
  - `partials/aside.html` **Done.**
- Move `hugo.yaml` menu data into a neutral data file, likely `src/data/navigation.ts` or `src/data/navigation.yaml`. **Done with `data/navigation.yaml` and a schema-validated Astro adapter.**
- Recreate metadata behavior:
  - title format **Done.**
  - description fallback **Done.**
  - canonical URL **Done.**
  - Open Graph image fallback **Done.**
  - Twitter card tags **Done.**
  - robots tags **Done.**
- Recreate alias and redirect behavior:
  - add `data/redirects.yaml` or `src/data/redirects.ts` as the explicit redirect manifest **Done.**
  - generate static Astro redirect pages for each source route **Done.**
  - match Hugo's current redirect page shape with canonical URL, `noindex`,
    `meta refresh`, fallback link, and optional JavaScript `location` **Done.**
  - extend the Astro overlay allowlist so Astro-owned alias routes replace Hugo
    alias pages only when their canonical target route has migrated **Done; ownership is derived from the migrated route list.**
  - keep external redirect targets valid for entries such as `/spring26/` **Done.**
- Recreate RSS only once Astro owns content sections that need feeds. **Deferred by design; Hugo continues to generate all RSS output during the additive spike.**

Acceptance criteria:

- A static Astro page has the same header, footer, social links, metadata, and global styles as Hugo. **Done.**
- Astro can generate Hugo-equivalent static alias and redirect pages for
  migrated routes without relying on Hugo's alias generator. **Done.**

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

- The homepage is rebuilt in Astro using real components instead of Hugo
  shortcode strings. **Done.**

## Phase 5: Migrate Low-Risk Static Pages

Goal: migrate pages that do not depend heavily on Hugo data APIs.

Good first candidates:

- `/about/contact-us/` **Done as `.astro`.**
- `/more/xen-branding/` **Done as `.mdx`.**
- `/resources/matrix/` **Done as `.mdx`.**
- `/contribute/code-of-conduct/` **Done as `.mdx`.**
- `/contribute/contribution-guidelines/` **Done as `.mdx`.**
- `/projects/hvmi/` **Done as component-driven Astro content.**

Tasks:

- Convert each Markdown file with shortcodes into `.mdx` or `.astro`. **Done for
  all Phase 5 routes.**
- Preserve route paths exactly.
- Preserve frontmatter fields needed for title, description, aliases, aside, page header visibility, and social images.
- Add redirects for aliases.

Acceptance criteria:

- Migrated routes match existing URLs.
- Existing Hugo routes continue to build for pages not migrated.
- Visual smoke tests pass for migrated pages.

Phase 5 migrated the remaining static About routes, every individual project
detail route, `/projects/hypervisor/openpgp-keys/`, and
`/resources/mailing-lists/`. Data-derived indexes and event pages remain owned
by Phase 6.

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

- `/research/` and individual research paper routes render from Astro data.
  **Done.**
- `/resources/downloads/`, `/resources/past-events/`, and pricing blocks render
  from Astro data. **Done.**
- Existing scripts are either reused or replaced with simpler Astro-native imports.
  **Done; checked-in download generation and research parsing remain reusable.**

Phase 6 adds four routes, bringing the Astro content allowlist to 33. The
Downloads page validates and renders `downloads-latest.json` while retaining
client-side search over the complete checked-in archive. Past-event metadata
and MDX content live in an Astro collection, and the archive sorts entries by
`eventEnd`. Xen Summit 2026 renders its event hero and pricing from Astro
components with validated shared ticket YAML.

## Phase 7A: Prove Standalone Astro Output

Goal: remove the remaining output-level blockers without changing build or
deployment ownership.

Completed:

- Migrated `/projects/all-projects/` from a validated shared project catalog and
  migrated `/resources/use-cases/` with Astro components.
- Replaced Hugo's concatenated `/contribute/`, `/resources/`, and `/more/`
  section pages with curated navigation-driven indexes.
- Added Astro output for `/404.html`, `/all/`, `/index.xml`, and
  `/headerfooter.html`.
- Preserved RSS for dated research and past-event entries and preserved the
  legacy header/footer fragment IDs.
- Retired the empty `/categories/` and `/tags/` taxonomy shells.
- Added `npm run test:astro:standalone` to enforce the exact standalone route
  inventory, links, assets, canonicals, redirects, RSS, 404, and fragment shape.

Acceptance criteria:

- The standalone Astro artifact passes its contract without Hugo output.
- Existing Hugo, integrated spike, default command, and deployment contracts
  remain unchanged until Phase 7.

## Phase 7: Flip Ownership To Astro

Goal: make Astro the primary static site generator.

Tasks:

- Change `npm run dev` to Astro dev. **Done.**
- Change `npm run build` to generate the complete Astro `public/` artifact.
  **Done.**
- Remove the overlay build and keep Hugo/Vite behind explicit `dev:legacy` and
  `build:legacy` rollback commands. **Done.**
- Stop the default and beta CI paths from writing Vite output into
  `themes/xen-project/static`. **Done.**
- Configure beta and production origins through `SITE_URL`. **Done.**
- Cut production publishing over after the beta acceptance gate. **Done.**
- Keep `scripts/downloads/getLinks.js` and
  `scripts/research/parse-research-papers.js`. **Done.**

Acceptance criteria:

- `npm run build` produces the production `public/` directory using Astro.
- CI no longer needs a Hugo-specific image unless there are remaining legacy pages.

## Phase 8: Remove Hugo

Goal: delete the old stack once no routes depend on it.

Tasks:

- Remove `hugo.yaml`, `hugo.dev.yaml`, `layouts/`, and `themes/xen-project/layouts`.
- Move any reusable static assets out of `themes/xen-project/static`.
- Move CSS from `themes/xen-project/assets/css` into Astro source structure.
- Remove legacy theme paths from UnoCSS `content.filesystem` and
  `content.pipeline` after the Hugo layouts are deleted.
- Remove `hugo-extended`, Hugo scripts, Hugo docs, and Hugo-specific CI settings.
- Delete `bundle-main.tsx` after the Hugo production path is retired. The
  allowlisted Astro routes already own their islands directly.

Acceptance criteria:

- No Hugo commands are needed locally or in CI.
- No content files contain Hugo shortcode syntax.
- Route, metadata, and asset checks pass.

## Post-Migration Technical Debt

These follow-ups are intentionally deferred until after production cutover and
Phase 8 cleanup. They are improvements to migrated behavior, not cutover
blockers.

Ghost now uses checked-in development and production environment modes:
localhost serves shared fixtures, production-mode builds use the production
Content API, Playwright intercepts deterministic fixtures, and a dedicated
staging command retains an unmocked integration check.

- Replace the initial Astro Latest News client script with a declarative React
  island. Preserve the Ghost Content API contract, loading and failure states,
  card metadata, keyboard-accessible carousel controls, and responsive layout.
- Remove the temporary imperative DOM card construction and consolidate the
  project and news carousel behavior once the React island owns Latest News.
- Make download updates deterministic. Historically, maintainers committed
  generated download JSON through reviewed merge requests, while the Hugo
  production publish job also refreshed that data in its temporary checkout.
  The current Astro `test` and `deploy` jobs still refresh downloads live, but
  copy-parity tests use the committed JSON. Replace that split with a scheduled
  or manually triggered update job that commits regenerated JSON and its
  reviewed snapshots through a merge request; then make tests and deployments
  consume only the committed data. See
  [`copy-parity.md`](./copy-parity.md#deferred-follow-up-deterministic-download-updates)
  for the proposed workflow.

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
- Compare output visually and with a link check. **Done:** screenshot smoke
  testing, shared navigation smoke testing, and integrated artifact link/asset
  checks are in place.

This spike should answer the important practical questions without committing the whole repo to the migration.

Estimated effort: **1 to 2 focused days** for the spike, assuming no package installation or CI constraints. Full migration is likely **1 to 3 weeks** depending on how exact the visual parity needs to be and whether old shortcode-heavy pages are converted manually or redesigned as components.

## Spike Verification Status

Verified on 2026-06-16:

- `npm run build` passes for the existing Hugo/Vite production path.
- `npm run astro:build` passes and outputs Astro spike routes to `dist-astro/`.
- `npm run astro:check` passes with no diagnostics.
- `npm run build:astro-spike` passes and overlays the migrated Astro route into
  `public/`.
- `npm run test:astro:links` passes against the integrated `public/` artifact.
- `npm run test:astro:smoke:public` passes against the integrated `public/`
  artifact.
- GitLab CI is configured to run on Node 24 LTS with Hugo supplied by the
  `hugo-extended` npm dependency.

Verified on 2026-06-18:

- `npm run astro:check` passes with no diagnostics.
- `npm run build:astro-spike` passes and overlays all 16 routes listed in
  `scripts/astro/migrated-routes.ts` into `public/`.
- Parent-route overlays copy only their Astro `index.html`, preserving
  Hugo-owned child routes in the integrated artifact.
- `tests/astro/react-islands.spec.ts` passes against the integrated artifact,
  covering direct Astro islands and the Astro-native action replacements.
- The full Playwright Astro suite passes with 45 tests.
- `npm run lint` passes with only the known LogoWheel TODO and
  `zoom-info.js` eslint-disable warnings.

Verified on 2026-06-19:

- Phase 5 adds 13 static routes, bringing the Astro content allowlist to 29.
- `npm run astro:check`, `npm run astro:build`, and
  `npm run build:astro-spike` pass.
- `npm run test:astro:links` passes against 50 generated HTML files.
- The full Playwright Astro suite passes with 81 tests, including route-level
  Phase 5 coverage and the existing high-value visual baselines.
- `npm run lint` passes with only the existing documented warnings.

Phase 6 verification on 2026-06-19:

- Phase 6 adds four data-driven routes, bringing the Astro content allowlist to 33.
- `npm run astro:check`, `npm run astro:build`, and
  `npm run build:astro-spike` pass.
- `npm run test:astro:links` passes against 50 generated HTML files.
- The full Playwright suite passes with 89 tests, including download-search,
  event ordering, event-detail, pricing, and redirect-ownership coverage.
- `npm run lint` passes with only the existing documented warnings.

Phase 7A verification on 2026-06-19:

- `npm run test:astro:standalone` passes against 48 Astro-generated HTML files
  with no Hugo output copied into `dist-astro/`.
- `npm run build`, `npm run build:astro-spike`, `npm run astro:build`,
  `npm run astro:check`, and `npm run lint` pass.
- `npm run test:astro:links` passes against the integrated artifact.
- The full Playwright suite passes with 103 tests, including standalone-route
  ownership, project catalog ordering, curated indexes, 404 behavior, and the
  reviewed All Projects and Use Cases visual baselines.

Phase 7 beta-cutover verification on 2026-06-20:

- The default `npm run build` generates 48 Astro HTML pages directly in
  `public/`.
- Standalone artifact validation passes for both beta and production
  `SITE_URL` values, including canonical and RSS origins.
- `npm run astro:check`, `npm run lint`, and the explicit `build:legacy`
  rollback path pass.
- The full Playwright suite passes with 103 tests against the beta-origin Astro
  artifact.

Current result:

- Astro is the default local build and owns both the beta deployment artifact
  and the default-branch production publish artifact.
- The 39 Astro routes include `/`, `/about/`,
  `/about/become-a-member/`, `/about/contact-us/`,
  `/contribute/code-of-conduct/`, `/contribute/contribution-guidelines/`,
  `/contribute/get-started/`, `/contribute/ci/`,
  `/contribute/ci/status/`, `/more/xen-branding/`, `/research/`, the three
  migrated research paper routes, `/resources/downloads/`, `/resources/matrix/`,
  `/resources/past-events/`, both migrated event detail routes, and
  `/resources/summit-2026/`, plus the remaining static About pages, individual
  project routes, Hypervisor OpenPGP keys, and mailing lists.
- Shared navigation tests now verify first-level menu links, mobile drilldown,
  keyboard submenu behavior, active navigation state, and shell rendering for
  every route listed in `scripts/astro/migrated-routes.ts`.
- High-value page screenshots now cover `/`, `/about/`,
  `/projects/all-projects/`, `/projects/hypervisor/`,
  `/resources/downloads/`, `/resources/summit-2026/`,
  `/resources/past-events/`, `/research/`, and `/contribute/ci/`.
- Homepage visual snapshots hide only the randomized star field; the dedicated
  island smoke test still verifies the Story and LogoWheel behavior.
- The static artifact checker verifies generated local links, local assets,
  canonical URLs, redirect targets, and `404.html`.
  `/blog` and historical `/wp-content/uploads` media are delegated because they
  are hosted outside this static-site artifact.
- The screenshot comparison is stable after removing the old debug toolbar from the Hugo baseline.
- The remaining build noise is Sass deprecation output from the existing theme styles, not a spike blocker.
- Hugo source pages remain in place only for the explicit rollback path and are
  scheduled for removal in Phase 8.
- The homepage Story now uses document scrolling and a sticky viewport instead
  of reparenting the Astro header, article, and footer into a nested
  react-spring scroller. Dedicated desktop and mobile scene snapshots retain
  both the Hugo reference and the approved Astro result, and manual staging
  commands can run the full suite or the focused Story checks against beta.

## Navigation Data Status

Astro migrated pages now read navigation from `data/navigation.yaml` through the
typed adapter in `src/data/navigation.ts`. The adapter parses YAML with
`js-yaml` and validates the recursive menu structure with Zod, so malformed
navigation data fails during Astro checks/builds instead of rendering silently.

The current menu is one submenu level deep. Playwright smoke coverage opens
each first-level desktop and mobile menu section and verifies the expected link
targets so navigation regressions are caught during route migrations.

Hugo still uses `hugo.yaml` and page frontmatter in the rollback build. Keep
those sources unchanged until Phase 8.

## Phase 7 Output Strategy

`npm run build` regenerates research data and builds Astro directly into
`public/`. `SITE_URL` selects the origin used for canonical, redirect, social,
and RSS URLs and defaults to `https://beta.xenproject.org`.

Use the following checks for the complete artifact:

1. `npm run build`
2. `npm run test:astro:links`
3. `npm run test:astro:smoke:public`

`npm run test:astro:standalone` performs a fresh build and enforces the exact
route inventory, canonical origin, redirects, RSS, 404, and
header/footer fragment contract.

### Ghost Header/Footer Contract

The Ghost blog consumes `/headerfooter.html` as the stable integration boundary
for the main site shell. Astro owns the header/footer markup and the
`#block-assets` contents; the Ghost theme should fetch that fragment, inject
`#block-assets` into the document head, and inject `#block-header` and
`#block-footer` into the page.

The fragment must stay wrapper-free, without top-level `<html>` or `<body>`
elements. `#block-assets` should point to cache-busted Astro assets such as
`/_astro/BaseLayout.*.css` and `/_astro/blog-shell.*.js`. The Ghost theme
should not hardcode hashed Astro filenames or legacy Hugo/Vite paths such as
`/css/style.min.css` and `/js/main.js`.

The current implementation uses an Astro post-build hook to discover the
generated BaseLayout CSS, build a small blog shell script from the menu scripts,
and write those URLs into `/headerfooter.html`. A future cleanup should replace
that filename-scanning step with a first-class Astro/Vite entrypoint or
manifest-backed helper so the fragment can be rendered with the correct asset
URLs directly. Keep `scripts/astro/check-public-artifact.js` as the acceptance
contract for this boundary.

Use `npm run test:astro:smoke:public` to run the screenshot and navigation
smoke tests against the `public/` artifact. The Playwright config
starts `serve public` automatically on `http://127.0.0.1:4321`. Stop any other
local server on that port before running the public smoke test.

Use `npm run test:astro:links` after `npm run build` to check the artifact
without starting a server. The checker treats root-relative
`/blog` URLs and historical `/wp-content/uploads` media as delegated, skips the special
`headerfooter.html` output when enforcing canonical tags, and validates redirect
pages by checking their refresh/link targets.
