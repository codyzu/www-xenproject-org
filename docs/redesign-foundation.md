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
- text, border, accent, and focus tokens tuned for dark surfaces first
- typography defaults
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

## Contrast Guidance

The redesign tokens are intended to be used as documented combinations, not as
an unrestricted color palette. Current token contrast checks against WCAG 2.x
ratios show these supported pairings:

| Pairing | Intended use | Minimum measured ratio |
| --- | --- | --- |
| `--xp-text-primary` on `--xp-surface-0` through `--xp-surface-3` | Headings and important UI copy | 12.63:1 |
| `--xp-text-secondary` on `--xp-surface-0` through `--xp-surface-3` | Body copy and supporting statements | 8.75:1 |
| `--xp-text-muted` on `--xp-surface-0` through `--xp-surface-3` | Metadata and lower-emphasis copy | 4.99:1 |
| `--xp-surface-0` text on `--xp-accent-primary` and `--xp-accent-secondary` | Accent-filled buttons and badges | 8.65:1 |
| `--xp-text-on-light` and `--xp-text-on-light-muted` on `--xp-surface-light` and `--xp-surface-light-raised` | Intentional light sections | 6.00:1 |
| `--xp-focus-ring` against dark and light surfaces | Keyboard focus indication | 3.21:1 |

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

Use `src/components/primitives/Heading.astro` and
`src/components/primitives/Text.astro` for new redesign typography. These
primitives encode responsive type scale, token-backed tones, and safe wrapping
behavior so narrow layouts do not require one-off font-size patches.

Use token-backed utilities first. Add custom CSS only when a behavior or layout
cannot be expressed clearly with utilities.

## Design Playground

The internal page at `/internal/design-system/` is the lightweight Astro-native
design playground. It is not public site content and must remain unlinked from
navigation. Use it to review the dark layered identity, tokens, surfaces, and
future primitives before applying them to public pages.
