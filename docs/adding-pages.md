# Add a page

Astro creates routes from files under `src/pages/`. For example,
`src/pages/about/example.mdx` becomes `/about/example/`. Choose MDX for prose
and Astro for structured, component-driven layouts.

## Easy: write an MDX page

MDX is Markdown with the option to import and render components. Ordinary
headings, lists, links, tables, and code blocks remain Markdown, so authors do
not need to write a component for a prose-heavy page.

Use the Astro-first `LongformLayout` for new prose pages:

```mdx
---
layout: ../../layouts/LongformLayout.astro
title: Example page
description: A short summary used in the page header and metadata.
keywords:
  - Xen Project
  - example
---

## First section

Write the page in Markdown. Use [descriptive link text](/technology/).
```

The relative layout path depends on the page depth. Copy it from a nearby MDX
page and verify the result with `npm run typecheck`. `title` is required;
`description`, `keywords`, `canonicalUrl`, `socialImage`, `image`, `aside`,
`hidePageHeader`, and `showFeedback` are supported when the page needs them.
Page feedback is enabled by default for public Astro-first content; set
`showFeedback: false` when the question is not appropriate. Do not add old Hugo
fields such as `date`, `draft`, or `menus`: Astro file routing and shared YAML
navigation replace them.

MDX can import an Astro component after its frontmatter when prose needs one:

```mdx
---
layout: ../../layouts/LongformLayout.astro
title: Example page
description: An example with a callout.
---
import Callout from '../../components/blocks/Callout.astro';

Introductory prose.

<Callout
  title="Important context"
  description="Keep component use focused and let Markdown carry the narrative."
/>
```

## Pro: compose an Astro page

Use `.astro` when the page needs cards, grids, diagrams, structured data, or a
distinct visual narrative. New pages use `BaseLayout` and the Astro-first
design system:

```astro
---
import CTA from '../../components/blocks/CTA.astro';
import Hero from '../../components/blocks/Hero.astro';
import BaseLayout from '../../layouts/BaseLayout.astro';

const title = 'Example page';
const description = 'A concise description for metadata and search.';
---

<BaseLayout {title} {description} publicShell>
  <Hero
    eyebrow="Example"
    title="Explain one clear idea."
    description="Give the reader enough context to choose a next step."
    actions={[{label: 'Explore technology', href: '/technology/'}]}
  />
  <CTA
    title="Choose the next action."
    actions={[{label: 'Start contributing', href: '/contribute/get-started/'}]}
  />
</BaseLayout>
```

Compose existing components from `src/components/primitives/` and
`src/components/blocks/` before adding a shared abstraction. Put unique page
composition under `src/components/pages/` or next to the route. New pages must
not import the legacy Sass theme or components from `src/components/legacy/`.
Read the [design-system guide](design-system.md) for component and content
rules.

## Register the route

Astro builds the route automatically, but the static artifact contract keeps an
explicit inventory in `scripts/astro/content-routes.ts`:

- Add a new Astro-first page to `redesignRoutes`.
- Keep migrated, copy-protected pages in `contentRoutes`.
- When intentionally moving an existing route from the legacy system to
  `BaseLayout`, also add its page file to the approved redesign list in
  `scripts/astro/check-redesign-boundaries.js`.
- Add old or alternate URLs only to `data/redirects.yaml`. Do not duplicate a
  redirect source in the content-route inventory.

The generated `/all/` page currently lists `contentRoutes`, while artifact
validation uses both route groups.

## Add the page to the mega-menu

The site has two navigation sources during the design-system migration:

- `data/navigation-v2.yaml` drives the new header mega-menu and footer on
  `BaseLayout` pages.
- `data/navigation.yaml` drives legacy pages and the header/footer fragment
  consumed by the Ghost blog.

Add a link to the appropriate group in `navigation-v2.yaml`. If visitors must
see it consistently on legacy pages and the blog, add the equivalent link to
`navigation.yaml` too. Both files are schema-validated by their adapters under
`src/data/`; preserve the existing shape, indentation, trailing slash style,
and `_blank` target for external destinations. Internal `/internal/*` tools do
not belong in either navigation source.

## Images and public files

Put URL-stable downloads, logos, and page images in `public/` and reference
them from the site root, such as `/img/example.svg`. Import optimized,
component-owned artwork from `src/assets/` so Astro can process it. See
[Images](images.md) before adding an asset.

## Verify the page

```sh
npm run check
npm run build
npm run check:dist
```

For a redesigned or interaction-heavy page, also run
`npm run test:e2e` and capture it with
`npm run screenshots -- /your/route/`.

Before review, confirm that the page has one visible `h1`, useful title and
description metadata, descriptive links and image alternatives, keyboard-safe
interactions, responsive layouts, and no unintended public URL changes.
