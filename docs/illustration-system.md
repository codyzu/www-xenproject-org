# Xen Illustration System

The Xen illustration system is the reusable visual language for the
Astro-first redesign. It should make Xen feel layered, precise, open,
architectural, trustworthy, and infrastructure-grade before a visitor reads the
supporting copy.

This system is not a collection of one-off hero images. It is a small set of
data models, Astro components, reusable overlays, asset rules, and art
direction constraints that can scale from the homepage to future Technology,
Safety, Embedded & Automotive, Community, Membership, Downloads, and project
pages.

## Architecture

Illustrations live under `src/components/illustrations/`:

```text
src/components/illustrations/
  primitives/
    IllustrationSceneShell.astro
    IllustrationLayerPlane.astro
    IllustrationLayerIndex.astro
    IllustrationConnectors.astro
    IllustrationGlow.astro
  scenes/
    LayeredPlatform.astro
```

Scene data and asset plans live under `src/data/illustrations/`:

```text
src/data/illustrations/
  types.ts
  layered-platform.ts
```

`src/components/illustrations/LayeredPlatform.astro` remains as a compatibility
wrapper, but new scene implementation should live in `scenes/` and compose
from primitives. The homepage should consume a scene through the `Hero` media
slot instead of owning illustration layout.

## Rendering Strategy

Use the simplest durable rendering medium for each element:

| Element | Preferred implementation | Reason |
| --- | --- | --- |
| Scene structure | Astro component | Owns semantics, variants, slots, data binding, and accessibility. |
| Layer labels and callouts | HTML | Keeps text selectable, readable, translatable, and accessible. |
| Scene layout and repeated recipes | UnoCSS plus `xen-*` shortcuts | Keeps styling token-backed and consistent with the redesign foundation. |
| Connectors, brackets, boundaries | SVG | Scales crisply and can inherit token colors. |
| Glow, grid, ambient light, shadows | CSS/SVG overlay | Reusable and adjustable without regenerating artwork. |
| Complex layer interiors | Transparent WebP | Adds premium material detail while preserving component composition. |
| Fallback transparent asset | Transparent PNG | Use only when WebP creates unacceptable edge artifacts. |
| Generated art | Transparent layer or interior asset | Use selectively after the renderer, labels, and accessibility are stable. |

Do not bake text into raster images. Do not generate full-scene artwork for
structured diagrams. Generated assets should be optional interiors or material
details inside an Astro-rendered scene.

## Asset Library

The first scene is the layered platform:

- Applications
- Guest systems
- Xen hypervisor
- Hardware

The shared asset plan in `src/data/illustrations/layered-platform.ts` defines:

- core layer planes
- isolation boundary treatment
- ambient overlays
- future production layer interiors

Future production assets should live under:

```text
src/assets/illustrations/layered-platform/
```

Expected first production files:

- `applications.webp`
- `guest-systems.webp`
- `xen-hypervisor.webp`
- `hardware.webp`

`xen-hypervisor.webp` is the first production layer asset. It establishes the
direction for future layer interiors: a transparent, wide, dark architectural
module with restrained Xen green boundary accents and no baked text.

Transparent WebP is the default. PNG is acceptable only for quality reasons.
Each imported asset must set `alt`, dimensions when available, `loading`,
`decoding`, and `fetchpriority` at the component/data boundary. Use empty `alt`
text when the visible HTML label and scene description already carry the
meaning.

## Composition Rules

- Keep scene definitions data-driven.
- Keep text in HTML.
- Keep connectors and boundary geometry in SVG.
- Keep glow, shadows, grids, and ambient light as reusable overlays.
- Make the Xen hypervisor the important isolation/control boundary without
letting glow overpower the scene.
- Prefer fewer meaningful marks over dense decorative detail.
- Static diagrams should not add keyboard stops.
- Future scene variants should reuse primitives before adding new components.

## Design Language

Xen illustrations should feel calm, premium, technical, architectural, and
timeless. They should feel closer to industrial design visualization than
cyberpunk marketing graphics.

The Xen Project visual identity is built around layered platform architecture.
Layer diagrams are not illustrations added after page design. They are
first-class design components that communicate architecture, isolation,
ownership, explicit boundaries, and inspectable systems. Future solution pages
should reuse this language before inventing unrelated visual metaphors.

There are two canonical diagram states:

- **Exploded:** teaches architecture, reveals ownership, explains separation,
  and shows boundaries. Use it for hero sections, architecture explanations,
  and educational content.
- **Assembled:** shows composition, complete systems, ecosystem projects, and
  deployment or reference architecture stories. Use it for ecosystem sections,
  deployment patterns, and reference architecture summaries.

Every layer should represent a meaningful architectural boundary. The typical
stack is applications, guest systems, Xen Hypervisor, and hardware. Future
pages may change layer labels, but should preserve the mental model of
explicit boundaries and ownership. Avoid decorative layers and layers that do
not map to a real architectural concept.

Persistent traits:

- layered dark surfaces
- explicit trust and isolation boundaries
- restrained Xen green as the primary accent
- secondary blue only as a supporting technical accent
- crisp geometry and visible structure
- shallow elevation and controlled light
- HTML labels and precise technical language

Avoid:

- generic AI imagery
- mascot-led hero identity
- excessive glow
- particles and abstract technology wallpaper
- text baked into images
- decorative marks that do not represent a system relationship

Motion must support the same technical language. Preferred motion includes
slight lift, subtle brightening, restrained depth, gentle breathing, and a
reduced-motion fallback. Avoid bouncing, spinning, elastic easing, continuous
attention-grabbing loops, and motion that distracts from technical content.

## Editorial Vocabulary

Preferred language for solution-page visuals and supporting copy:

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

Avoid language that makes Xen sound magical, frictionless, generic, or driven
by hype:

- magic
- seamless
- effortless
- revolutionary
- futuristic
- generic cyber or cloud language
- hype-driven AI language

## Solution Page Storytelling

Layered diagrams work best when the page teaches a system instead of presenting
isolated features. A useful solution-page arc is:

```text
Hero -> problem -> architecture principles -> technical capabilities ->
domain example -> ecosystem -> evaluation -> participation -> CTA
```

This is guidance, not a rigid template. Use it to make future pages feel like
siblings while still fitting the subject, audience, and available proof.

## Production Workflow

1. Define the scene intent and audience.
2. Compose the scene with Astro primitives, HTML labels, SVG connectors, and
   CSS/SVG overlays.
3. Add or update the typed scene manifest and asset plan.
4. Review the scene in `/internal/design-system/`.
5. Integrate the scene into the target page.
6. Run build and interaction checks before generating art.
7. Generate or author one asset at a time only when code-native primitives are
   insufficient.
8. Integrate the asset through the scene data model.
9. Review desktop, mobile, reduced motion, contrast, and performance.
10. Optimize asset dimensions and format.
11. Repeat until the scene meets the art direction and acceptance criteria.

AI generation belongs after composition and accessibility are stable. It should
produce transparent interiors, material details, or restrained page-specific
assets, not replace the scene renderer.

## Review Loop

For every illustration:

1. Review the scene without generated assets.
2. Compare against the design language: layers, isolation, architecture,
   precision, openness, trust, infrastructure.
3. Add one asset or overlay change.
4. Review in the real page and internal design-system page.
5. Check mobile, desktop, reduced motion, and screen-reader naming.
6. Check asset weight and layout stability.
7. Iterate or reject the asset.

Quality matters more than first-pass completion.

## Performance Budget

- No Canvas or WebGL for the first version.
- No required client-side JavaScript.
- No animation libraries.
- Stable scene dimensions to prevent layout shift.
- CSS/SVG overlays before extra raster requests.
- Transparent WebP for complex assets.
- Slot-sized exports rather than oversized full-resolution renders.
- `loading="lazy"` and `decoding="async"` by default for non-critical assets.
- Use `fetchpriority="high"` or preload only when measurement shows the asset
  is part of the LCP path and the optimization helps.

The homepage illustration must remain fast and should not become dependent on
large unoptimized media.

## Accessibility

Meaningful scenes should use `role="img"` with a clear accessible name and
description. Decorative connectors, glows, shadows, grids, and redundant layer
interiors should be hidden from assistive technology or use empty `alt` text.

Labels, callouts, and captions remain HTML. Static scenes do not receive
keyboard focus. Motion must be disabled by `prefers-reduced-motion: reduce`.
Use only documented token contrast pairings for text and labels.

## Future Roadmap

- Safety boundary scene: isolation, containment, and assurance.
- Automotive stack scene: hardware domains, specialized guests, and safety
  partitions.
- Community network scene: maintainers, contributors, members, projects, and
  governance relationships.
- Membership ecosystem scene: support model, stewardship, infrastructure, and
  project outcomes.
- Downloads flow scene: release artifacts, verification, documentation, and
  upgrade path.

Add each future scene as a scene manifest plus Astro composition. Do not fork
the homepage implementation.

## Acceptance Criteria

An illustration-system change is complete only when:

- shared primitives remain reusable across scenes
- scene data lives in typed manifests
- labels remain HTML
- connectors remain SVG unless there is a documented reason otherwise
- glows, grids, and shadows are reusable overlays
- optional raster assets are imported through scene data
- accessibility naming and reduced-motion behavior are verified
- homepage integration still uses the hero media slot
- `/internal/design-system/` demonstrates the scene or primitive
- `npm run build`, `npm run astro:check`, `npm run lint`, and relevant
  Playwright tests pass before commit
