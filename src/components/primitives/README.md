# Primitives

Astro-first reusable UI building blocks live here: buttons, containers, sections, cards, grids, stacks, badges, and headings.

Use token-backed UnoCSS utilities and keep custom CSS minimal.

Typography primitives should own responsive scale and wrapping behavior. Use
`Heading.astro` and `Text.astro` for new redesign headings, labels, and body
copy so narrow layouts do not rely on one-off font-size fixes.

Do not add a primitive for page-local presentation. See the component boundary
and token rules in [`docs/design-system.md`](../../../docs/design-system.md).
