# Astro Redesign Foundation

This document defines the boundary between the migrated site and the new
Astro-first redesign foundation.

## Component Folders

- `src/components/legacy/` contains migrated compatibility components. These
  components may rely on the legacy Sass cascade and should only receive bug
  fixes or compatibility maintenance.
- `src/components/primitives/` contains small Astro-first building blocks such
  as buttons, containers, cards, grids, badges, and headings.
- `src/components/blocks/` contains composed reusable sections such as heroes,
  CTAs, feature grids, stats, timelines, and FAQs.
- `src/components/pages/` contains route-specific components that are not
  broadly reusable.

New redesign work should start in `primitives/`, `blocks/`, or `pages/`.
Do not add new redesign components to `legacy/`.

## Block Philosophy

Blocks are opinionated compositions of primitives. They should solve recurring
content patterns, not page-specific layouts. If a block cannot reasonably be
reused across multiple pages, it probably should not become part of the shared
block library. Prefer local page composition for one-off needs, and let the
homepage consume the design system rather than define it.

A reusable block should:

- use existing primitives where possible
- use design tokens and `xen-*` shortcuts where appropriate
- avoid legacy SCSS
- support responsive layouts
- preserve accessibility and keyboard behavior
- be documented or demonstrated in `/internal/design-system`
- have at least two realistic use cases
- avoid homepage-specific naming or assumptions

## Layout And CSS Boundary

- `src/layouts/LegacyLayout.astro` owns existing public pages, the migrated
  header/footer shell, generated UnoCSS, and `src/styles/legacy.scss`.
- `src/layouts/BaseLayout.astro` is the clean Astro-first layout for new pages.
  It imports generated UnoCSS and `src/styles/foundation/base.css`.
- `src/styles/legacy.scss` is the only allowed entrypoint for the migrated Sass
  cascade from `src/styles/theme/main.scss`.
- New pages must not import `src/styles/legacy.scss` or files under
  `src/styles/theme/`.

Generated UnoCSS is intentionally available to both layouts because existing
React islands and new UI both use prefixed `uno-*` classes.

## Tokens

The new foundation tokens live in `src/styles/foundation/tokens.css` as CSS
custom properties. The token set is intentionally small:

- surface colors from `surface-0` through `surface-3` for the dark layered
  identity
- occasional light contrast surfaces for readability or emphasis
- text, border, accent, and focus tokens tuned for dark surfaces first, with
  Xen green as the primary brand accent
- typography defaults and a named type scale for `Display XL`, `Display L`,
  `Heading XL`, `Heading L`, `Heading M`, body, and caption text
- spacing and section rhythm
- container widths
- radius
- elevation
- motion
- focus states
- z-index layers

Token-backed UnoCSS utilities are exposed under the `xp` namespace, for
example `uno-bg-xp-surface-0`, `uno-bg-xp-surface-2`,
`uno-text-xp-text-primary`, `uno-border-xp-border-muted`,
`uno-bg-xp-accent-primary`, `uno-shadow-xp-md`, and `uno-max-w-xp-wide`.

UnoCSS currently uses `presetWind3({prefix: 'uno-'})`. Keep that in place
until a dedicated Wind 4 migration is evaluated, because migrated pages and
React islands depend on Tailwind 3-style UnoCSS behavior. The top-level
`theme.colors` aliases such as `primary`, `secondary`, `surface`, `action`,
and `brand` are legacy-compatible tokens. New redesign work should use
`theme.colors.xp.*` accessors backed by the CSS variables in
`tokens.css`; the Uno theme exists to make utilities ergonomic, not to become
the source of token values.

The redesign font utilities are backed by UnoCSS's web-fonts preset using
Google Fonts for now: `uno-font-sans` maps to Inter and `uno-font-mono` maps
to JetBrains Mono. `BaseLayout.astro` loads the Google Fonts stylesheet for
new Astro-first pages. The CSS variables `--xp-font-sans` and `--xp-font-mono`
keep the same families plus system fallbacks for base styles. If the project
self-hosts fonts later, preserve the utility-facing API and replace the font
loading source rather than changing component classes.

The primary visual identity is dark, layered, and infrastructure-grade. New
high-impact pages should treat dark surfaces as the default brand canvas, then
use light surfaces sparingly for intentional contrast, long-form readability,
or emphasis. Do not interpret this as "every section must be black"; use
surface steps, elevation, muted borders, and accent color to create depth.
Surface 0 is the deepest page canvas, surface 1 is the default dark section
canvas, surface 2 is the raised card or proof layer, and surface 3 is reserved
for active, selected, or locally emphasized surfaces.

Xen green is the primary accent for new redesign work. Use it for primary
actions, active states, focus treatment, and key brand highlights. Blue remains
available as a secondary technical or informational accent, but should not be
the dominant highlight color on new pages.

## Contrast Guidance

The redesign tokens are intended to be used as documented combinations, not as
an unrestricted color palette. Current token contrast checks against WCAG 2.x
ratios show these supported pairings:

| Pairing | Intended use | Minimum measured ratio |
| --- | --- | --- |
| `--xp-text-primary` on `--xp-surface-0` through `--xp-surface-3` | Headings and important UI copy | 11.68:1 |
| `--xp-text-secondary` on `--xp-surface-0` through `--xp-surface-3` | Body copy and supporting statements | 8.10:1 |
| `--xp-text-muted` on `--xp-surface-0` through `--xp-surface-3` | Metadata and lower-emphasis copy | 4.61:1 |
| `--xp-accent-primary-text` on `--xp-accent-primary`, `--xp-accent-primary-strong`, and `--xp-accent-primary-active` | Primary action labels | 5.20:1 |
| `--xp-surface-0` text on `--xp-accent-primary` and `--xp-accent-secondary` | Accent-filled badges and technical labels | 8.81:1 |
| `--xp-text-on-light` and `--xp-text-on-light-muted` on `--xp-surface-light` and `--xp-surface-light-raised` | Intentional light sections | 5.95:1 |
| `--xp-focus-ring` against dark and light surfaces | Keyboard focus indication | 3.16:1 |

Do not use `on-light` text tokens on dark surfaces, dark-surface text tokens on
light surfaces, or soft accent background tokens as text colors. Avoid creating
new text tones with opacity unless the final composited color has been checked
against its surface. Treat these constraints as part of the component contract
for new primitives and blocks.

Small reusable UnoCSS shortcuts may use the `xen-` prefix when they capture a
repeated project-level recipe, such as a panel surface, card surface, or common
action treatment. New redesign shortcuts should use `xen-*`; reserve new
`uno-*` shortcuts for legacy compatibility helpers. Keep one-off styling inline
as `uno-*` utilities, avoid page-specific shortcut names, and do not use
shortcuts as a substitute for Astro components. Components own structure,
semantics, slots, variants, and composition.
The shared `xen-action-primary` and `xen-focus` shortcuts are green-forward and
should be the default treatment for primary actions and keyboard focus in the
redesign system. `xen-action-primary` uses separate primary, hover, active, and
text tokens so action contrast does not depend on legacy brand aliases.

Use `src/components/primitives/Heading.astro` and
`src/components/primitives/Text.astro` for new redesign typography. These
primitives encode responsive type scale, token-backed tones, and safe wrapping
behavior so narrow layouts do not require one-off font-size patches.
`Heading.astro` exposes `display-xl`, `display-l`, `heading-xl`, `heading-l`,
and `heading-m` for new work, while preserving the earlier `hero`, `display`,
`section`, `subsection`, and `card` aliases for compatibility. `Text.astro`
exposes body, lead, small, caption, eyebrow, and monospaced annotation sizes.

Use iconography as a lightweight aid to technical clarity. Prefer simple line
icons at 20px for inline UI, 24px for compact cards, and 32px only for larger
explanatory moments. Icons should clarify actions, status, system concepts, or
navigation; avoid decorative icon use in the foundation system.

Use token-backed utilities first. Add custom CSS only when a behavior or layout
cannot be expressed clearly with utilities.

## Layered Diagram Components

The current reusable diagram abstraction comes from the Embedded & Automotive
implementation:

- `src/components/diagrams/PlatformLayersDiagram.astro` composes a full
  labelled platform diagram.
- `src/components/diagrams/Layer.astro` renders a single tilted layer surface.
- `src/components/diagrams/platform-layers.ts` defines the shared TypeScript
  data shape.
- `src/data/embedded-and-automotive-platform-layers.ts` is the current page
  data source for both the hero diagram and ecosystem diagram.

These components are part of the emerging Astro-first redesign language. They
should be reused for solution pages that need to explain architecture,
separation, ownership, platform composition, or inspectable technical
boundaries.

`PlatformLayersDiagram` currently accepts the following props:

| Prop | Type | Current behavior |
| --- | --- | --- |
| `id` | `string` | Optional DOM id seed for accessible title and summary ids. Defaults to `platform-layers`. |
| `title` | `string` | Required diagram title from `PlatformLayersDiagramData`; used as the default eyebrow when no eyebrow is provided. |
| `eyebrow` | `string` | Optional visible diagram label. |
| `metaLabel` | `string` | Optional visible technical label in the header. Defaults to `CSS layer model`. |
| `summary` | `string` | Required screen-reader summary describing the diagram's meaning. |
| `layers` | `PlatformLayerData[]` | Required ordered layer data. |
| `variant` | `'standard' \| 'hero'` | Optional visual variant. Defaults to `standard`. |
| `defaultShadowReceivers` | `boolean` | Optional default for whether layers after the first receive projected shadow surfaces. Defaults to `true`. |
| `interactive` | `boolean` | Optional opt-in interaction flag. Defaults to `true` only for `variant="hero"`. |
| `class` | `string` | Optional class list hook for page-local layout adjustment. |

The shared layer data shape is:

| Field | Type | Current behavior |
| --- | --- | --- |
| `title` | `string` | Required layer title. |
| `eyebrow` | `string` | Optional layer category label. |
| `tone` | `'applications' \| 'guests' \| 'xen' \| 'hardware'` | Optional color treatment. Defaults to `guests` in `Layer`. |
| `description` | `string` | Required explanatory copy. |
| `items` | `{label: string; icon?: string}[]` | Optional domain strip items rendered inside the layer. Icons use existing icon utility classes. |
| `itemsLabel` | `string` | Optional accessible label for the domain strip. |
| `receivesShadow` | `boolean` | Optional per-layer override for projected shadow rendering. |

The lower-level `Layer` component also accepts layout props used by
`PlatformLayersDiagram`: `width`, `shift`, `offset`, `bodyWidth`, `hoverX`,
`hoverY`, `zIndex`, and `receivesShadow`. These are implementation controls,
not a public page-authoring API. Pages should normally pass diagram data to
`PlatformLayersDiagram` instead of instantiating `Layer` directly.

### Diagram States

`variant="hero"` is the current exploded state. It uses wider spacing, larger
plates, hero-specific text width, visible separation between layers, and
interaction by default. Use it for hero sections, architecture teaching, and
separation-focused explanations where the diagram needs to make ownership and
boundaries obvious.

The default `variant="standard"` is the current assembled state. It uses a
more compact composition and does not enable interaction by default. Use it for
ecosystem, deployment, platform-composition, and reference-architecture
sections where the goal is to show how technologies fit together.

Embedded & Automotive uses both states from the same data contract:

- The hero diagram uses `embeddedAutomotivePlatformLayersDiagram` with
  `variant: 'hero'`, `metaLabel: 'Exploded Architecture'`, and shorter layer
  descriptions focused on separation.
- The ecosystem diagram uses `embeddedAutomotiveEcosystemLayersDiagram` with
  the default standard variant, `metaLabel: 'Open stack'`, and richer layer
  `items` showing applications, Linux/Yocto, Zephyr/RTOS, Xen responsibilities,
  and hardware resources.

### Accessibility and Interaction

`PlatformLayersDiagram` renders a `<figure>` with an accessible title wired by
`aria-labelledby`. The visible header label provides the title, while the
`summary` prop renders as visually hidden text referenced by
`aria-describedby` on the stack. Every diagram data object must include a
concise summary that explains the technical relationship the diagram is
communicating, not just the visual appearance.

Interactivity should be opt-in unless the diagram is acting as the primary hero
visual. The current component defaults `interactive` to `true` for the hero
variant and `false` for the standard variant. Interactive diagrams receive
keyboard focus, subtle lift, gentle brightening, and small layer offsets on
hover or focus. Keep this interaction informative and restrained; do not add
interaction to dense ecosystem diagrams unless it improves comprehension.

The component already handles `prefers-reduced-motion` by disabling animation,
reducing transition duration, removing hover lift, and suppressing extra layer
offsets. Future diagram work must preserve that behavior.

### CSS Boundary

The diagram uses component-scoped custom CSS because its core behavior depends
on 3D transforms, stacked grid placement, generated shadow receivers, masked
grid texture, hover-state CSS variables, responsive deconstruction on mobile,
print handling, and reduced-motion overrides. Those concerns are clearer as
local CSS than as long chains of utilities.

Continue to use UnoCSS utilities and token-backed primitives for ordinary page
layout around the diagram. Custom CSS is justified for diagram geometry,
state-specific motion, generated surfaces, and responsive behavior that cannot
be expressed clearly with utilities.

### Future Extension Points

The current API is intentionally small. Likely future extension points, if
multiple pages need them, include named assembled/exploded modes beyond the
existing `variant` values, alternate layer counts, richer item grouping,
diagram legends, or page-author controls for scale and density. Do not treat
those as finalized APIs until at least two real pages require the behavior.

## Design Playground

The internal page at `/internal/design-system/` is the lightweight Astro-native
design playground. It is not public site content and must remain unlinked from
navigation, page indexes, breadcrumbs, and other public discovery surfaces. Use
it to review the dark layered identity, tokens, surfaces, and future primitives
before applying them to public pages.

Routes under `/internal/*` are contributor resources that may be deployed to
production for direct-URL access. They should use page-level
`robots="noindex, nofollow"` and should generally be excluded from the sitemap.
Do not add internal routes to shared navigation data or public page listings.
