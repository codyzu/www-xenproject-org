# Illustration system

The illustration system is the Astro-first visual language for explaining
layers, isolation, ownership, and platform relationships. It is code-native by
default: semantic structure and labels stay in Astro and HTML, connectors stay
in SVG, and optional raster artwork supplies material detail rather than the
meaning of a scene.

## Current architecture

Reusable illustration code lives under `src/components/illustrations/`:

```text
primitives/                 scene shell, planes, labels, connectors, glow
scenes/LayeredPlatform      composed applications/guests/Xen/hardware scene
LayeredPlatform.astro       compatibility wrapper
```

Typed manifests and assets live in:

```text
src/data/illustrations/
src/assets/illustrations/
```

`src/data/illustrations/layered-platform.ts` defines the scene, layer labels,
accessible descriptions, visual roles, and optional imported assets. The
homepage consumes the scene through its hero media slot rather than owning the
renderer.

## Choose the rendering medium

| Content | Preferred medium |
| --- | --- |
| Scene semantics, variants, and data | Astro and TypeScript |
| Labels, descriptions, and callouts | HTML |
| Layout and repeated visual recipes | UnoCSS and token-backed `xen-*` shortcuts |
| Connectors and architectural boundaries | SVG |
| Grid, glow, light, and shadow | CSS or SVG overlays |
| Complex material detail | Imported transparent WebP or PNG |

Do not bake labels into an image or generate a complete diagram as a raster.
Generated artwork, when used, should be an optional transparent interior that
can be removed without losing the scene's meaning.

## Composition rules

- Every layer and connector represents a real technical relationship.
- Keep scene definitions typed and data-driven.
- Keep visible labels selectable and translatable.
- Make the Xen boundary visually clear without overpowering the content.
- Reuse primitives and overlays before adding a scene-specific implementation.
- Keep diagrams static unless interaction materially improves comprehension.
- Put unique narrative composition in the page; share only the stable scene.

The current layered platform scene represents applications, guest systems, the
Xen hypervisor, and hardware. Future scenes may use different labels, but they
should preserve explicit boundaries and ownership rather than adding
decorative layers.

Use separated layers to teach isolation, responsibility, or construction. Use
a compact stack to show a composed platform or reference architecture. These
are arrangements, not fixed component presets.

## Art direction

Illustrations should feel precise, calm, architectural, and
infrastructure-grade. Prefer dark layered surfaces, crisp geometry, restrained
Xen green boundary accents, shallow elevation, and controlled light. Blue is a
supporting technical accent.

Avoid generic AI or cyber imagery, particles, excessive neon, mascot-led hero
identity, decorative technical marks, and motion that exists only to attract
attention. Motion may use slight lift, brightening, depth, or gentle breathing,
but the complete stack should move as a unit and must stop under
`prefers-reduced-motion`.

## Add or change a scene

1. Define the audience, engineering idea, layer relationships, and accessible
   summary.
2. Model the content in `src/data/illustrations/`.
3. Compose it from existing Astro primitives, HTML labels, SVG connectors, and
   reusable overlays.
4. Demonstrate the scene on `/internal/design-system/` and integrate it into
   the real page.
5. Review desktop, tablet, mobile, reduced motion, contrast, and screen-reader
   naming before considering raster artwork.
6. Add one optimized imported asset at a time only when code-native rendering
   cannot provide the required material detail.

Meaningful scenes use `role="img"` with a useful name and description.
Decorative geometry and redundant image interiors are hidden from assistive
technology or use empty alternative text. Static scenes do not receive focus.

Keep dimensions stable to avoid layout shift. Prefer CSS and SVG to extra
requests, export raster assets near their rendered size, lazy-load noncritical
art, and use high fetch priority only when measurement shows an LCP benefit.

An illustration change is complete when its content remains understandable
without optional artwork or motion, its labels remain HTML, its semantics and
data are typed, and the relevant build, type, lint, and browser checks pass.
