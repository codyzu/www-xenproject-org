# npm scripts

The public workflow is deliberately small:

```sh
npm run dev          # Local Astro development server
npm run check        # Lint, types, docs links, and unit tests
npm run build        # Complete live-data artifact in dist/
npm run check:dist   # Artifact contract plus design boundaries; no rebuild
npm run test:e2e     # One fixture build, artifact validation, and all browser tests
npm run preview      # Serve the existing dist/ artifact
```

`build` uses live download providers. `build:test` uses explicit download and
Ghost fixtures plus the search-ranking corpus so browser tests are deterministic.

## Check helpers

- `check:code`: runs `lint` and `typecheck`.
- `lint`: runs XO only.
- `typecheck`: runs Astro checking with the download fixture; it does not make
  a second live provider request.
- `test:docs`: validates repository documentation links.
- `test:unit`: runs `test:downloads` and `test:search`.
- `check:artifact`: strictly validates the existing `dist/`, including routes,
  internal links, copied public assets, sitemap, RSS, redirects,
  `headerfooter.html`, canonicals, and the 404 page.
- `check:boundaries`: validates source-level legacy/new-design isolation.
- `check:dist`: runs both artifact and boundary checks without building.

## Browser tests

`test:e2e` is the only self-contained browser command. The focused commands
below reuse the existing `dist/` and never rebuild it:

- `test:e2e:run`: full Playwright suite in two phases. General coverage may run
  in parallel; search runs afterward with one worker for deterministic Pagefind
  interaction timing.
- `test:e2e:high-value`: focused responsive/navigation coverage used in CI.
- `test:e2e:search`: replaces only the existing Pagefind index with test data,
  then runs search coverage.
- `test:e2e:copy`: copy-parity suite.
- `test:e2e:copy:update`: intentional copy-parity snapshot updates.
- `test:e2e:snapshots:update`: intentional non-copy browser snapshot updates.
- `test:staging` and `test:staging:homepage`: remote beta-site checks; neither
  uses `dist/`.

Run `build:test` once before combining several focused local suites:

```sh
npm run build:test
npm run check:dist
npm run test:e2e:copy
npm run test:e2e:high-value
```

## Data and utilities

- `search:refresh`: fetch and validate live Ghost posts.
- `search:ensure`: retain a local cache or seed it with the fixture for `dev`.
- `search:index`: rebuild Pagefind against the existing `dist/`.
- `search:fixture`: prepare the synthetic Ghost cache.
- `screenshots`: capture documented routes and viewports.

The search-prefixed commands are implementation helpers used by the primary
workflows and CI; they are not alternate build commands.
