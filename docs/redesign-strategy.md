# XenProject.org Redesign Strategy

This document captures the strategic and technical direction for the
XenProject.org redesign after the Astro migration. It is a planning document:
it should guide future implementation work, but it does not define the exact
homepage layout or introduce new components by itself.

## Redesign North Star

The redesign should make XenProject.org feel professional, credible, modern,
and technically deep. The site should support membership growth, contributor
growth, and ecosystem confidence, because those outcomes directly support the
long-term health of the Xen Project.

The primary audience for the homepage is senior engineers and technical
decision-makers who can bring Xen into teams, products, infrastructure, and
organizations. The site should also remain useful to contributors, users,
members, sponsors, press, and the broader open source virtualization community.

The core message is that Xen is not legacy technology. Xen is a mature, active,
battle-tested hypervisor that continues to power important systems. The site
should counter the perception that "Xen is old" or "Xen is dying" by showing a
project that is modern, serious, strategically important, and actively
maintained.

The design should keep some warmth and personality, but the primary impression
should be enterprise-grade and technically trustworthy. Avoid gimmicky visuals
or overly playful treatments that make the project feel less serious.

## Visual Theme and Feeling

"Layers" is the core visual metaphor.

Xen enables layers of isolation, virtualization, safety, infrastructure, and
trust. The visual direction should feel like layered systems sliding into
place: structured, precise, calm, and strong. It should communicate depth,
clarity, motion, and infrastructure-grade reliability.

The Xen website is built around layered systems. Layers are not only
illustrations; they are reusable interface elements that represent
architecture, separation, ownership, explicit boundaries, and inspectable
systems. Solution pages should reuse this visual language instead of inventing
unrelated metaphors for each domain.

Layer diagrams are first-class design components, not artwork added after the
page is otherwise designed. They should carry technical meaning: what owns
what, where isolation begins, which boundaries are explicit, and how a system
can be inspected or reasoned about.

Layered diagrams currently use common arrangements, not fixed presets:

- **Separated layers:** use when a page needs to teach architecture,
  ownership, isolation, explicit boundaries, or layered responsibilities. The
  physical separation helps readers understand how the system is constructed.
- **Compact stack:** use when a page needs to communicate composed platforms,
  integrated systems, deployment views, ecosystem relationships, or reference
  architectures. The compact arrangement emphasizes the complete platform.

Neither arrangement is better. Choose the arrangement that best supports the
engineering story, and allow additional arrangements to emerge naturally from
future pages rather than freezing the language around only these two forms.

Every diagram layer should map to a real architectural boundary. The default
mental model is applications, guest systems, the Xen hypervisor, and hardware.
Future pages may change the labels for their domain, but they should preserve
the model of explicit boundaries and ownership. Avoid decorative layers or
layers that do not represent a meaningful technical concept.

The Xen Project's primary visual identity uses a dark, infrastructure-inspired
palette. Dark surfaces are the default brand canvas for new high-impact pages
because they can communicate depth, focus, technical sophistication,
infrastructure, and layered systems. This does not mean every page or every
section must be dark. It means the strongest brand moments should start from a
dark foundation and use elevation, contrast, light, and accent deliberately.

The design should feel:

- Modern.
- Calm.
- Confident.
- Technical.
- Structured.
- Infrastructure-grade.

Lighter surfaces are allowed, but they should be intentional and limited. Use
them for contrast, readability, data-heavy content, or emphasis when a dark
section would make the experience less clear. Avoid letting "dark identity"
become a monotonous black theme; the system should rely on layered surface
steps, muted borders, restrained highlights, and readable typography rather
than making every section visually identical.

Animation can support the layered-systems metaphor, but it should be subtle,
useful, and performance-conscious. Motion should clarify relationships,
transitions, or system structure. It should not distract from the content or
make the site feel like a product demo detached from the seriousness of the
project.

Motion should communicate engineering, not entertainment. It should reinforce
depth, hierarchy, layering, and focus. Preferred motion includes subtle lift,
gentle brightening, slow breathing, and restrained depth or parallax. Avoid
bouncing, spinning, elastic motion, flashy looping, and motion that distracts
from technical content. Any motion used for layered diagrams or related
technical UI must respect `prefers-reduced-motion`.

Avoid making mascot-driven or overly playful visuals the main homepage
identity. Those assets can still have a place in community or historical
contexts, but they should not carry the primary brand impression.

## Solution Page Principles

Solution pages should teach architecture before products. They should show
boundaries before features. They should emphasize engineering over marketing.
They should use layered diagrams as the primary visual language. They should
introduce ecosystem projects only where they naturally support the technical
story. They should end with participation and evaluation paths rather than
sales language.

Prefer language that makes engineering decisions, responsibilities, ownership,
and evidence visible. Choose words because they clarify architecture, not
because they sound technical. Useful examples include:

- explicit
- visible
- inspectable
- ownership
- isolation
- architecture
- maintainable
- platform
- deterministic
- long-lived
- mixed-criticality
- composable
- open engineering

Avoid language that makes Xen sound magical, frictionless, or generic. This is
editorial guidance meant to prevent vague marketing language, not a banned-word
list for every possible context. In particular, avoid:

- magic
- seamless
- effortless
- revolutionary
- futuristic
- generic cyber or cloud language
- hype-driven AI language

A typical solution page arc is:

```text
Hero -> problem -> architecture principles -> technical capabilities ->
domain example -> ecosystem -> evaluation -> participation -> CTA
```

This is guidance rather than a rigid template. The goal is for solution pages
to feel like siblings while still fitting the subject, audience, and proof
available for each domain.

Ecosystem sections should show how Xen complements other projects rather than
replacing them. The Embedded & Automotive page is the current reference:

- Xen provides the virtualization and isolation boundary.
- Linux provides rich operating systems and services.
- Yocto Project supports embedded Linux build and distribution construction.
- Zephyr supports RTOS-style embedded workloads.
- AGL provides an automotive Linux platform.
- Hardware and SoC platforms provide shared compute, memory, interrupts,
  devices, and peripherals.

## Component Strategy

Do not keep evolving the carried-forward Hugo-era design system as the future
design system. The migration preserved the existing visual system and React
islands so the site could move to Astro safely, but that system should be
treated as compatibility infrastructure rather than the long-term foundation.

Migrated components should move toward a `legacy/` boundary:

```text
src/components/
  legacy/
  primitives/
  blocks/
  pages/
```

`legacy/` contains migrated components from the previous site. "Legacy" does
not mean broken or bad. It means the components are preserved for existing
pages, but they are not the future design direction. Legacy components should
be frozen except for bug fixes or necessary migration work.

`primitives/` contains small reusable UI building blocks, such as:

- `Button`
- `Card`
- `Container`
- `Section`
- `Grid`
- `Stack`
- `Badge`
- `Heading`

`blocks/` contains reusable marketing and content sections, such as:

- `Hero`
- `CTA`
- `FeatureGrid`
- `LogoCloud`
- `Stats`
- `Timeline`
- `FAQ`

`pages/` contains page-specific components for the homepage, membership,
safety, automotive, support, downloads, community, and similar routes.

Avoid versioned folders such as `v1/` and `v2/`. Those names become ambiguous
over time because they do not describe intent. Prefer names that explain the
role of the component system: `legacy/`, `primitives/`, `blocks/`, and
`pages/`.

New work should use Astro-first components designed for Astro plus
UnoCSS/Tailwind-style utilities. React islands should remain available where
interactivity requires hydration, but static content and layout should default
to Astro components.

## CSS and Layout Strategy

Legacy and new pages can coexist while the redesign is implemented
incrementally.

Legacy pages may use a `LegacyLayout.astro`. New pages should use a separate
`BaseLayout.astro` or another clearly named non-legacy layout. The important
boundary is that new pages should not inherit the legacy SCSS cascade.

Example layout split:

```text
LegacyLayout.astro
  - imports legacy SCSS
  - imports generated UnoCSS
  - wraps pages in a legacy body class

BaseLayout.astro
  - imports new base/global styles
  - imports generated UnoCSS
  - avoids legacy SCSS
```

`legacy.scss` should only be imported by the legacy layout. The generated
UnoCSS file can be shared by both legacy and new layouts, especially because
existing React islands use prefixed `uno-*` utilities. The `uno-` prefix helps
reduce collisions with legacy CSS while allowing new utility-driven work to
share the same generated stylesheet.

The long-term goal is to reduce broad SCSS dependencies and move design
consistency into tokens, utilities, and small components. This makes the design
system easier to reason about, easier to test in isolation, and easier for
future contributors to extend.

## Storybook Decision

The old site used Storybook during the Hugo-era design system. Maintaining
Storybook may not be worth it for this Astro marketing and content site.
Storybook is most useful for large product design systems with many interactive
components, multiple teams, and a release process for component packages.

For XenProject.org, a lighter Astro-native pattern page is likely enough.
Consider creating an internal pattern or design-system page instead of
reintroducing Storybook.

Possible routes include:

- `src/pages/internal/components.astro`
- `src/pages/internal/design-system.astro`

The pattern page can show:

- Typography.
- Colors.
- Buttons.
- Cards.
- Grids.
- CTAs.
- Hero variants.
- React islands.
- Light and dark surfaces.

This page should be useful to maintainers and future contributors without
creating a separate toolchain to maintain.

Internal pattern and design-system routes should live under `/internal/*`.
These pages may be deployed to production for direct maintainer access, but
they are not public website content: keep them out of navigation and public
listings, set `noindex, nofollow`, and exclude them from the sitemap.

## Migration Strategy

Avoid a big-bang rewrite. Keep current pages working with legacy components and
legacy layout boundaries while new pages are built with the new component
system.

The homepage should be the proving ground for the new visual direction,
component model, content strategy, and layout system. After that, migrate
high-impact pages that influence trust, adoption, and membership growth, such
as:

- Membership.
- Safety and security.
- Automotive.
- Support.
- Downloads.
- Community.

Remove legacy components only when nothing depends on them. Until then, keep
the compatibility layer stable and boring. The goal is to make progress without
breaking public URLs, existing content, or known page behavior.

## Questions to Ask When Reworking Any Page

Use this checklist before redesigning or rebuilding a page:

- What is the goal of this page?
- Who is the primary audience: engineer, executive, contributor, member, user,
  sponsor, or press?
- What action should the visitor take next?
- Does this page support membership growth, contributor growth, ecosystem
  trust, or technical adoption?
- Does the page make Xen feel active and credible?
- Is the page too generic?
- Is the page showing proof: releases, users, members, use cases, benchmarks,
  integrations, talks, docs, or community activity?
- Does the page use the dark infrastructure-grade identity where it matters,
  while keeping any light surfaces intentional?
- Can the page be built with new primitives and blocks?
- Does it avoid legacy SCSS?
- Does it need JavaScript or hydration?
- Is the content accessible, responsive, and fast?
- Can this page be maintained easily by future contributors?

## Non-Goals

This document does not:

- Define the exact homepage layout.
- Implement new homepage components.
- Delete legacy components.
- Remove or reintroduce Storybook.
- Require a big-bang redesign.

Those decisions should happen in later implementation tasks after the repo
owner explicitly chooses the next step.
