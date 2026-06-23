# Download Data

The downloads page renders from checked-in JSON data.

To refresh the data locally:

```sh
npm run downloads
```

Review the generated changes in `assets/data/downloads.json`,
`assets/data/downloads-latest.json`, and `static/data/downloads.json` before
committing them.

The download scripts may need provider credentials or network access depending
on the upstream source being refreshed.
