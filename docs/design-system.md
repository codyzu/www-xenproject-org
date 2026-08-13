# Xen Project design system

This is the canonical guide for new pages and for moving legacy pages onto the
Astro-first design system. The migration is incremental: both systems are live,
but new work must use the foundation described here.

## Direction

The design system exists to explain engineering: architecture, isolation,
ownership, evidence, maintainability, governance, and participation. Pages
should feel calm, precise, open, technically credible, and
infrastructure-grade. Trust should come from clear structure and supported
claims rather than generic marketing language.

Layers are the central visual metaphor. Use them when they communicate real
system boundaries, platform composition, or ownership. Dark layered surfaces
are the primary brand canvas for high-impact pages. Light surfaces are useful
for intentional contrast and long-form readability, not as a second unrelated
theme.

Before composing a major page, define:

- the primary audience and engineering question;
- the evidence that answers that question;
- the one next action the page should make clear;
- the section, diagram, or example that gives the page its own identity.

A common solution-page narrative is:

```text
primary idea -> problem -> engineering principle -> capabilities ->
domain example or process -> evaluation -> project health -> participation
```

Use that sequence as an editorial prompt, not a required template.

## Legacy and new boundaries

- `src/layouts/LegacyLayout.astro` owns migrated pages, the legacy shell,
  generated UnoCSS, and `src/styles/legacy.scss`.
- `src/layouts/ContentLayout.astro` is the prose/layout adapter for legacy MDX.
- `src/layouts/BaseLayout.astro` owns the clean foundation and the new public
  shell.
- `src/layouts/LongformLayout.astro` gives prose-heavy pages an Astro-first
  presentation on `BaseLayout`.
- `src/styles/legacy.scss` is the only entrypoint for the old Sass cascade.
  New pages must not import it or anything under `src/styles/theme/`.

Legacy components are compatibility infrastructure. Keep them stable except
for bug fixes and migration work; do not use them on new pages.

The component folders express intended reuse:

- `primitives/`: small layout and interface elements such as `Button`,
  `Container`, `Grid`, `Heading`, `Stack`, `Surface`, and `Text`;
- `blocks/`: reusable sections such as `Hero`, `CTA`, `FeatureGrid`,
  `LogoCloud`, `Stats`, and `Callout`;
- `pages/`: route-specific composition that should not become a shared API;
- `legacy/`: carried-forward components used by existing pages and Ghost.

Compose existing primitives and blocks first. Keep a one-off section local.
Extract a new shared block only after multiple real uses establish a stable
contract. A block must be responsive, accessible, independent of legacy Sass,
and demonstrated on `/internal/design-system/`.

## Layout, tokens, and typography

Foundation tokens live in `src/styles/foundation/tokens.css`; UnoCSS exposes
them under the `xp` namespace. Prefer token-backed utilities such as
`uno-bg-xp-surface-1`, `uno-text-xp-text-primary`, and
`uno-border-xp-border-muted`. Small repeated project recipes use the `xen-`
prefix. The `uno-` prefix and Wind 3 behavior remain compatibility contracts
while migrated pages and React islands depend on them.

Use the surface scale intentionally:

- surface 0: deepest page canvas;
- surface 1: normal dark section;
- surface 2: raised cards and proof;
- surface 3: selected or locally emphasized UI;
- light surfaces: occasional long-form or contrast sections.

Use Xen green for primary actions, focus, active states, and meaningful brand
highlights. Blue is secondary and informational. Use documented text/surface
pairings rather than inventing opacity-based colors; the token combinations
are contrast-tested.

Use `Heading.astro` and `Text.astro` for foundation typography. They own scale,
tone, and safe wrapping. `BaseLayout` loads Inter and JetBrains Mono; preserve
the utility-facing API if font delivery changes.

Design desktop, laptop, tablet, and mobile together. Intermediate widths are
especially important for diagrams and split layouts. Prefer stable grids,
containers, and component-level responsive rules over content-specific
wrapping fixes. All motion must respect `prefers-reduced-motion`.

## Component choices

- Use `Hero` to establish one page idea, supporting context, and focused
  actions.
- Use `FeatureGrid` for parallel capabilities, criteria, resources, or facts.
  Do not use it for a sequence or a narrative with unequal hierarchy.
- Use local `Grid` and `Card` composition when groups have different roles or
  the layout belongs to one page.
- Use `Callout` for engineering context, cautions, scope, evidence, or
  participation notes.
- Use `CTA` only for a genuine next step, not to fill space.
- Use `Stats` for sourced quantitative proof and `LogoCloud` for known member
  or ecosystem relationships. Never invent metrics or imply endorsement.
- Use React only when browser-side interaction requires hydration. Static
  content and layout default to Astro.

Layered platform diagrams use
`src/components/diagrams/PlatformLayersDiagram.astro`. Authors provide a title,
accessible summary, semantic layers, and either the `hero` or `standard`
variant. Every layer must map to a real architectural boundary. Keep labels
brief, hide decorative geometry from assistive technology, and never require
motion or hover to understand the diagram. See
[Illustration system](illustration-system.md) for scene artwork.

## Writing and accessibility

Write cautiously but confidently. Prefer concrete terms such as explicit,
inspectable, ownership, boundary, isolation, evidence, governance, and open
engineering when they genuinely clarify the subject. Avoid unsupported
security, performance, scale, certification, and compliance claims, along with
generic “seamless”, “revolutionary”, or “best-in-class” language.

Keep eyebrows short, headings focused, and introductions concise. CTA labels
should name their destination: “Review security policy” is better than “Learn
more”. Put cautions beside the claim they qualify.

Pages must have one clear `h1`, a logical heading order, descriptive links,
keyboard-visible focus, sufficient contrast, useful alternative text, and no
meaning that depends only on color or motion. Static diagrams should not add
keyboard stops.

## Navigation and the playground

`data/navigation-v2.yaml` drives the new disclosure mega-menu. A complete
top-level label is one button. Hover opens a menu only for fine pointers;
click, Enter, and Space toggle it; Escape closes it and restores focus; and an
outside pointer press closes it without moving focus. Mobile uses a
details-based accordion.

Legacy pages and the Ghost fragment still consume `data/navigation.yaml`.
Follow [Add a page](adding-pages.md) when a new destination must appear in both
shells.

`/internal/design-system/` is the deployed design playground. Keep it out of
navigation and public indexes, set `noindex, nofollow`, and exclude it from the
sitemap. Use it to review tokens, primitives, blocks, diagrams, motion, and
responsive states before applying them to a public page.

## Definition of done

A design-system change is ready when it uses the correct layout boundary,
composes existing APIs where practical, works at mobile through desktop widths,
preserves keyboard and reduced-motion behavior, and is represented in the
playground when reusable. Run the repository checks in the root README and the
relevant Playwright coverage before merging.
