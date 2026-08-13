# Page Components

Route-specific Astro components live here when a page needs local composition that is not reusable enough for `blocks/`.

Keep these components on the new foundation unless the route is explicitly a legacy compatibility page.

Page-specific composition is preferred to a premature shared block. Promote a
pattern only after repeated use stabilizes its API; see
[`docs/design-system.md`](../../../docs/design-system.md).
