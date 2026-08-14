# Download data

Downloads are an Astro content collection populated at build time from the
Xen, XCP-ng, and Mirage OS upstream providers. The same validated collection
renders the current-release cards and the static `/data/downloads.json`
archive used by browser search.

Production and normal local builds use live upstream data:

```sh
npm run build
```

Any fetch, empty-provider, or schema-validation failure stops the build. The
repository does not contain a production download-data snapshot or silently
fall back to stale data. A failed deployment therefore leaves the previously
deployed site intact.

## Test fixture

Deterministic browser tests opt into the small fixture in
`tests/fixtures/downloads.js`:

```sh
DOWNLOADS_SOURCE=fixture npm run build
```

Only `fixture` and `live` are accepted values. Do not set `fixture` in a
deployment job. `npm run build:test:astro` selects it automatically.

Provider discovery lives in `scripts/downloads/`; collection loading and
strict failure behavior live in `src/loaders/downloads.js`. Add or change a
provider there, update its unit tests, and verify both paths:

```sh
npm run test:downloads
DOWNLOADS_SOURCE=fixture npm run build
```
