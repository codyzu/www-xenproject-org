# Site architecture

Astro is the only local and production static-site generator. `npm run build`
writes the complete deployable site to `dist/`; `public/` contains
URL-stable source assets copied into that artifact.

## Source map

- `src/pages/`: file-based public routes.
- `src/content/`: Astro content collections.
- `src/components/`: Astro components and interactive React islands.
- `src/layouts/`: legacy, foundation, and long-form page shells.
- `src/styles/`: the isolated legacy Sass entrypoint and new foundation CSS.
- `src/data/` and `data/`: typed adapters and checked-in shared data.
- `public/`: files whose public paths must remain stable.
- `scripts/astro/content-routes.ts`: the explicit artifact route inventory.
- `data/redirects.yaml`: aliases and redirects for migrated routes.
- `scripts/astro/check-public-artifact.js`: the built-site contract.

Set `SITE_URL` to control canonical, redirect, social, sitemap, and RSS origins.
It defaults to `https://beta.xenproject.org`; production builds use
`https://xenproject.org`.

## Page systems during migration

The Astro migration is complete, but the visual migration is not.

- `LegacyLayout` and `ContentLayout` render carried-forward pages with legacy
  Sass, components, fonts, header, footer, and `data/navigation.yaml`.
- `BaseLayout` and `LongformLayout` render the new foundation with token-backed
  CSS, blocks, primitives, and the mega-menu in `data/navigation-v2.yaml`.
- React islands remain valid when a feature needs hydration. Static UI should
  use Astro.

The boundary checker prevents foundation pages from importing legacy CSS and
prevents unreviewed existing routes from switching layouts accidentally. Read
[Design system](design-system.md) and [Add a page](adding-pages.md) before
changing the boundary.

## Build and deployment

The build refreshes research data, renders Astro, and creates the Pagefind
index. GitLab packages `dist/` as a `site.tar.gz` archive with a top-level
`public/` directory for the beta and production deployment consumers. The
browser test job extracts that same artifact and previews it locally.

Beta builds use the beta origin. The default-branch `publish` job rebuilds with
the production origin so absolute metadata and feeds are correct. CI refreshes
download data and uses live Ghost search content when protected credentials are
available; fork merge requests use the synthetic Ghost fixture.

## Ghost header and footer

The Ghost blog consumes `/headerfooter.html` as a stable integration boundary.
Astro owns these fragment elements:

- `#block-assets` for cache-busted legacy CSS and the blog shell script;
- `#block-header` for shared header markup;
- `#block-footer` for shared footer markup.

The fragment has no top-level `html` or `body`. Astro post-build hooks rename
the generated page to the flat-file URL, discover the generated
`LegacyLayout` stylesheet, combine the required menu scripts, and inject their
hashed URLs. Keep `check-public-artifact.js` as the acceptance contract for
this behavior. The fragment remains on the legacy shell until Ghost and all
public pages can move together.

## Verification

Run the checks documented in the root README. `npm run test:astro:standalone`
performs a fresh build and additionally enforces routes, RSS,
`headerfooter.html`, redirects, assets, canonical URLs, and the 404 contract.
Use `npm run test:astro:smoke:public` for the browser suite against the complete
artifact.
