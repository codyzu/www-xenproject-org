# Download Data

The downloads page renders from checked-in JSON data.

To refresh the data locally:

```sh
npm run downloads
```

To refresh a single provider while carrying the other checked-in groups
forward unchanged, pass its key:

```sh
npm run downloads -- xcpng
```

The registered provider keys are `xen`, `xcpng`, and `mirageos`. XCP-ng uses
the official ISO index to discover the newest stable release, then publishes
the current standard installer, network installer, SHA256 manifest, and
manifest signature through the XCP-ng mirror service.

Review the generated changes in `assets/data/downloads.json` and
`public/data/downloads.json` before committing them. The downloads page derives
its latest-release view from the checked-in archive at build time.

The download scripts may need provider credentials or network access depending
on the upstream source being refreshed.
