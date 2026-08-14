# Add a research paper

Research entries are one-file BibTeX records under this directory. An Astro
content loader parses and validates them during the build, lists them at
`/research/`, and creates a page at `/research/<citation-key>/`.

## Add an entry

Create one `.bib` file containing exactly one record:

```bibtex
@inproceedings{smith2026xen,
  title = {A Study of {Xen}},
  author = {Alex Smith and Sam Lee},
  year = {2026},
  url = {https://example.org/paper},
  abstract = {A short summary of the work.},
  keywords = {virtualization, hypervisor},
  booktitle = {Example Conference},
}
```

Required fields are `title`, `author`, and a four-digit `year`. `url`,
`abstract`, `keywords`, `journal`, and `booktitle` are optional. Separate
authors with `and` and keywords with commas. Protect capitalization that
BibTeX must preserve with braces, as in `{Xen}`.

Use a lowercase, descriptive citation key because it becomes the page URL.
Prefer a matching filename, keep the abstract concise, and link to an
accessible paper or publisher page when one is available.

## Verify

```sh
npm run build
```

There is no generated data file to review or commit. Parsing fails for invalid
BibTeX, multiple records in one file, duplicate citation keys, missing required
fields, or an invalid optional URL.
