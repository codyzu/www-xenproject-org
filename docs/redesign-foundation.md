# Astro Redesign Foundation

This document defines the boundary between the migrated site and the new
Astro-first redesign foundation.

## Design Purpose

The Xen Project design system is an engineering communication system, not a
generic marketing design system. Its purpose is to explain architecture,
boundaries, ownership, isolation, evidence, maintainability, governance, and
participation clearly. Pages should teach before they promote.

The redesign should feel technical, calm, inspectable, precise, open, premium
but restrained, and infrastructure-grade. Avoid hype-first marketing, generic
SaaS visual language, cyberpunk decoration, excessive neon, novelty motion,
and unsupported superiority claims. Trust should come from clarity,
inspectability, and visible engineering context.

## Page Authoring

Every major page should answer one primary engineering question. Write that
question before outlining the page, then use it to decide what content does
not belong. Capabilities, ecosystem references, governance notes, and calls to
action should support the answer rather than turning the page into an
exhaustive feature catalog.

Current examples:

- Homepage: What is Xen, and why should engineers and organizations trust the
  project?
- Embedded & Automotive: How can teams consolidate mixed-criticality workloads
  without blurring boundaries?
- Cloud & Infrastructure: Why should infrastructure ownership remain explicit
  and inspectable?
- Safety-Critical Systems: What does certification-oriented engineering
  require beyond architecture?

Each major page may also carry one memorable sentence that expresses its point
of view. Use it once as a heading, statement, callout, or section anchor. It
should sound like engineering judgment, not a slogan. Examples in current
work include "Safety work is evidence work", "Open infrastructure starts with
an open virtualization layer", and "Consolidate the platform without blurring
the boundaries".

Each solution page should contain one signature section that breaks the normal
page rhythm and belongs specifically to that subject. This can be page-local
composition; do not prescribe a new component. Current examples are the
homepage layered architecture hero, the Embedded & Automotive
mixed-criticality/platform composition story, the Cloud & Infrastructure
Xen-centered ecosystem, and the Safety-Critical Systems Safety Committee and
evidence trail.

The common narrative arc is:

```text
Hero and primary idea -> problem framing -> engineering principle ->
technical capabilities -> domain-specific example, ecosystem, or process ->
evaluation path -> governance and project health -> participation -> final CTA
```

This is a starting point, not a universal template. Section order should
follow the narrative. Pages should not include sections merely because another
page has them. Shared language is desirable; identical pages are not.

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

Prefer stability over abstraction. Extract shared components only after two or
three genuine uses demonstrate that the authoring contract is stable. Page-
local composition is healthy when a section has a unique narrative role, when
groups need different hierarchy, or when a page needs one signature visual
treatment. Shared primitives are preferable to mega-components, and readable
code matters more than reducing file length.

Use `FeatureGrid` for parallel capabilities, evaluation criteria, related
resources, project-health signals, and similarly weighted facts. Avoid it when
items represent a sequence, one item needs much stronger emphasis, the content
is really a narrative or process, or the page needs a signature visual
treatment.

Use local `Grid` plus `Card` composition when groups have different roles,
cards need distinct hierarchy, the layout is unique to one narrative, or the
content structure is not repeated elsewhere.

Use `Callout` for strong engineering statements, caution or scope
clarification, reference architecture context, participation notes, and
evidence/process clarification. Use `CTA` for genuine next steps, focused
mid-page decision points, and end-of-page participation or evaluation actions.
Do not use CTA blocks merely to fill space.

Use `Stats` for meaningful proof or quantitative context. Use `LogoCloud` for
member or ecosystem trust, not decoration. Do not invent numbers or imply
endorsement beyond known relationships.

Recurring content patterns should be documented before they are extracted:
related resources, open governance and project health, ecosystem roles,
participation and membership, technical capabilities, evaluation checklists,
and engineering caution notes. These patterns can use existing blocks or
page-local composition depending on the content hierarchy.

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

## Editorial Tone

The written voice should be cautious but confident, technically specific, and
respectful of system context. Explain Xen's architecture positively and let
informed readers make comparisons. Do not attack competitors directly.

Prefer language that makes engineering decisions, responsibilities, ownership,
and evidence visible. Choose words because they clarify architecture, not
because they sound technical. Useful examples include explicit, visible,
inspectable, boundaries, ownership, isolation, architecture, evidence,
maintainable, long-lived, platform, deterministic, mixed-criticality,
governance, participation, open engineering, certification-oriented, and
safety-conscious. Use these carefully instead of repeating the same word in
every section.

Avoid or strongly limit magic, seamless, effortless, revolutionary,
next-generation, futuristic, best-in-class, generic cloud-native language,
generic cyber imagery or language, and enterprise-grade claims without
evidence. This guidance exists to prevent vague marketing language, not to ban
individual words in every circumstance. Do not make unsupported security,
scale, latency, performance, certification, or compliance claims.

Eyebrows should be short category labels, usually styled uppercase by the
visual system. Prefer noun phrases that orient the reader without repeating
the heading. Headings should be concise, active where possible, sentence case
in authored text, and focused on one main idea. Avoid headings that wrap into
four or more lines at ordinary desktop widths. Section introductions should
usually be one short paragraph that explains why the section matters without
repeating the heading or every card.

CTA labels should describe the destination or action. Prefer labels such as
Explore the hypervisor, Explore architecture, Review isolation resources,
Explore XCP-ng, View CI resources, View downloads, Read governance, Review
security policy, Start contributing, Become a member, Explore membership, and
View reference architecture. Avoid Learn more, Click here, Find out more, Open
page, and repeated Explore labels with no object. Primary and secondary
actions should reflect the page's actual next steps; not every card needs a
CTA.

Cautionary content belongs near the relevant engineering discussion. Use it
when certification context needs clarification, a capability depends on system
design, a project artifact is an input rather than a guarantee, or a reference
architecture is illustrative rather than universal. The tone should be
educational, concise, and specific about scope. Say what the project supports,
not only what it does not. For safety pages, keep this principle explicit:
Xen source code is not itself safety certified. Certification depends on the
complete system, integration context, process, evidence, tooling, validation,
and safety case.

## Responsive Philosophy

Design for desktop, laptop, tablet, and mobile. Intermediate tablet widths are
first-class, especially for diagrams, split layouts, and dense card grids.
Avoid one-off content hacks for wrapping. Prefer systemic responsive
strategies in primitives, blocks, and shared CSS: stable grid tracks,
container-aware widths, safe heading wrapping, and reduced-motion behavior.

## Layered Diagram Components

The reusable layered diagram language emerged from the Embedded & Automotive
page. It is part of the Astro-first redesign foundation because it expresses
Xen's core architectural promise: explicit boundaries, visible ownership,
isolation, and inspectable platform structure.

Layer diagrams are not decorative illustrations added after a page is designed.
They are first-class design components. Future solution pages should reuse this
language before inventing unrelated visual metaphors.

Use layered diagrams when a page needs to explain architecture, separation,
ownership, platform composition, deployment patterns, ecosystem fit, or
reference architectures. Keep the surrounding layout and copy concise so the
diagram teaches the system rather than becoming decoration.

### Diagram Arrangements

Layered diagrams use common arrangements, not fixed presets:

- **Separated layers:** use when a page needs to teach architecture,
  ownership, isolation, explicit boundaries, or layered responsibilities. The
  physical separation helps readers understand how the system is constructed.
- **Compact stack:** use when a page needs to communicate composed platforms,
  integrated systems, deployment views, ecosystem relationships, or reference
  architectures. The compact arrangement emphasizes the complete platform.

Neither arrangement is better. Choose the arrangement that best supports the
engineering story. Additional arrangements may emerge naturally through future
pages, so do not freeze the visual language around only these two forms.

The current concrete component is
`src/components/diagrams/PlatformLayersDiagram.astro`, backed by
`src/components/diagrams/platform-layers.ts`. Its current authoring contract
includes:

- `title`, optional `eyebrow`, optional `metaLabel`, and required `summary`
- `variant: 'standard' | 'hero'`
- `frameBleed: 'none' | 'subtle'`
- `layers`
- per-layer `title`, optional `eyebrow`, optional `tone`, optional
  `emphasis`, `description`, optional `items`, optional `itemsLabel`, and
  optional `receivesShadow`
- layer tones: `applications`, `guests`, `xen`, and `hardware`
- layer emphasis: `primary`

The `summary` is the accessible description for the diagram. Decorative
geometry is hidden from assistive technology. Mobile behavior collapses the
3D stack into readable stacked plates, hides the compact `metaLabel`, and
keeps labels and item chips readable. Hero diagrams are interactive by default;
standard diagrams are not.

### Layer Semantics

Every layer should represent a meaningful architectural boundary. The typical
stack is:

- Applications
- Guest systems
- Xen Hypervisor
- Hardware

Future pages may change these labels for a specific domain, but should
preserve the mental model of explicit boundaries and ownership. Avoid
decorative layers and layers that do not map to a real architectural concept.

Variable layer counts are supported. Current proven examples include the
4-layer Embedded & Automotive diagram, the 4-layer Cloud & Infrastructure
diagram, and the 5-layer Safety-Critical Systems diagram. Use approximately
three to six meaningful layers. Do not add layers only for decoration. If the
story requires many more layers, reconsider whether one diagram is the right
format.

When Xen appears in a layered architecture diagram, the Xen boundary should
generally be the visual anchor. Use the shared `emphasis: 'primary'` API for
this. Stronger edge treatment, restrained glow, and elevation are appropriate,
but do not create page-local glow CSS. Emphasis does not mean other
technologies are unimportant; it clarifies the subject of the site.

`frameBleed: 'subtle'` allows a restrained inline-start and bottom bleed when
the diagram is used as a primary architectural visual. The purpose is depth
and dimensionality. No text may be clipped, overflow must not collide with
neighboring content, and standard diagrams may remain fully contained.

Layer content should be concise: short eyebrow, clear title, one brief
description, and two to four chips where useful. Avoid paragraphs on plates,
tiny text, decorative technical jargon, repeated copy already present beside
the diagram, logos inside every layer, and unsupported architecture claims.
The diagram should teach structure; surrounding cards and prose should explain
details.

### Motion

Motion should communicate engineering, not entertainment. Preferred diagram
motion includes slight lift, subtle brightening, restrained depth, gentle
breathing, and a reduced-motion fallback. Avoid bouncing, spinning, elastic
easing, continuous attention-grabbing loops, and motion that distracts from
technical content.

### Accessibility and Interaction

Every diagram must include an accessible summary that explains the technical
relationship being communicated, not just the visual appearance. Interactivity
should be opt-in unless the diagram is acting as the primary hero visual. Keep
interactive behavior informative and restrained, and preserve
`prefers-reduced-motion` support.

The meaningful diagram order should match semantic order. Motion and hover
states are never required to understand content. Focus-within behavior should
match hover where the diagram is interactive.

### CSS Boundary

Use UnoCSS utilities and token-backed primitives for ordinary page layout
around diagrams. Component-scoped custom CSS is acceptable for diagram geometry,
state-specific motion, generated surfaces, and responsive behavior that cannot
be expressed clearly with utilities. Avoid broad component refactors or new
diagram APIs until at least two real pages require the behavior.

Deferred diagram features are not yet part of the system: connectors,
overlays, annotations, generic badges, arbitrary per-layer geometry,
universal diagram plugins, and interactive diagram builders. Do not extend the
diagram API speculatively. Add new capabilities only when a real page cannot
communicate its story clearly without them.

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
