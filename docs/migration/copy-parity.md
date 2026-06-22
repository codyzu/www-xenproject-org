# Hugo-to-Astro copy parity

`tests/astro/copy-parity.spec.ts` uses Playwright's native ARIA snapshots with global `deep-equal` child matching to protect the authored content under `<main>` on every route in `scripts/astro/migrated-routes.ts`. Hugo supplied the initial migration baseline. Each route was audited, accidental losses were restored, and the resulting Astro accessibility tree is now the approved baseline enforced by CI.

The audit complements screenshot tests: screenshots protect layout, while ARIA snapshots protect paragraphs, headings, lists, links and destinations, controls, and image alt text. Snapshots use Playwright's accessibility tree without rewriting text or flattening semantic structure. The only preprocessing is:

- marked external-service result containers are hidden from the snapshot;
- the independently tested, client-mounted cookie-consent banner is hidden from the membership-page snapshot;
- absolute internal links are converted to route-relative destinations so host configuration does not cause noise.

Ghost posts are external website content and are excluded. Checked-in download and research data are deterministic and included. Runtime CI results are excluded, but their authored surrounding copy is included.

## Run the audit

Build Astro, then run the focused Playwright suite:

```sh
npm run build
npm run test:astro:copy-parity
```

The focused command starts `serve public` through the existing Playwright configuration and writes the standard Playwright report.

## Review and update the approved baseline

Snapshot updates are explicit and must never be part of CI:

```sh
npm run build
npm run test:astro:copy-parity:update
git diff -- tests/astro/copy-parity.spec.ts-snapshots
```

The update command changes only copy-parity snapshots. It writes Playwright's native `ariaSnapshot()` output literally because Playwright's codegen updater automatically converts many numbers with two or more digits into regular expressions. Normal visual snapshot updates exclude `@copy-parity`, preventing screenshot maintenance from changing the copy baseline.

Never accept all snapshot changes without reading the diff. For each changed route:

1. Compare the Astro page with the Hugo source and the audit inventory.
2. Restore accidental removals in Astro.
3. If a difference is intentional, document its narrow section in `data/copy-parity-exceptions.yaml`.
4. Update only the affected route's snapshot and review the copy diff and exception reason together.

The exception file is a review ledger, not executable test configuration. It cannot suppress, mask, or rewrite a mismatch. Once approved, the exact snapshot is the test contract. Future removal of either legacy copy or approved Astro-only copy therefore fails CI. Wildcard and route-wide exclusions are not permitted. Ghost content does not require an exception because it is external service data.

To update one route instead of the whole suite, pass its route text through the npm script:

```sh
npm run test:astro:copy-parity:update -- --grep '/about/'
```

## Deferred follow-up: deterministic download updates

The Astro `test` and `deploy` jobs currently run `npm run downloads`, while the copy-parity job tests the committed download data. An upstream release could therefore produce deployment content that differs from the reviewed copy-parity baseline. Numeric regexes are not an adequate solution because new releases also change list structure and link destinations.

Handle this as a separate migration follow-up. The intended workflow is:

1. Run `npm run downloads` in a scheduled or manually triggered update job.
2. Commit the generated download JSON through a reviewed merge request.
3. Update and review the downloads ARIA and visual snapshots in that merge request.
4. Build, test, and deploy Astro using the same committed download data.
5. Remove the live download refresh from the Astro `test` and `deploy` jobs once the update workflow exists.

Until that follow-up is complete, reviewers should treat changes to the download scripts, generated JSON, CI refresh commands, and download snapshots as a separate concern from Hugo-to-Astro copy parity.
