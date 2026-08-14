# Copy-parity regression tests

The copy-parity suite protects the authored accessibility tree under `<main>`
for routes in `contentRoutes`. Its snapshots cover headings, paragraphs,
lists, links and destinations, controls, and image alternatives. It
complements visual tests, which protect layout and appearance.

The original Hugo comparison is complete. The checked-in Astro snapshots are
now the regression baseline; Git history retains the migration audit.

## Run the suite

```sh
npm run build:test
npm run test:e2e:copy
```

`build:test` creates one artifact with isolated download and Ghost fixtures.
The focused copy command reuses that artifact and starts the Astro preview
server. External result containers, the independently tested cookie
banner, and host-only differences in absolute internal links are normalized or
excluded. Build-time download and research collection output remains part of
the baseline.

## Approve an intentional content change

```sh
npm run test:e2e:copy:update -- --grep '/about/'
git diff -- tests/astro/copy-parity.spec.ts-snapshots
```

Review the changed route and snapshot together. If the change intentionally
alters protected migrated content, record its narrow scope and reason in
`data/copy-parity-exceptions.yaml`. That file is a review ledger, not a way to
mask mismatches; the literal updated snapshot remains the test contract.

Never accept all generated changes without reading the diff. Normal visual
snapshot updates exclude copy-parity tests so they cannot silently update this
baseline.
