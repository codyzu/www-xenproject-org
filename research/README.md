# Contributing Research Papers

Thank you for contributing to the Xen Project research collection!

We welcome new research papers related to Xen, virtualization, hypervisors, cloud computing, and related topics.

This repository collects papers in **BibTeX** format to maintain a standard familiar to researchers and academics.

## 📚 How to Add a New Paper

1. **Create a new `.bib` file** inside the [`research/`](.) directory (one file per paper).
2. **Use valid BibTeX syntax** following the required fields outlined below.
3. **Submit a Merge Request** with your `.bib` file added.

Once your merge request is accepted:
- The site will automatically parse your entry.
- Your paper will appear in the searchable papers list.
- A dedicated page will be created for your paper.

---

## 📄 BibTeX File Guidelines

Each paper must have its own `.bib` file.  
Example filename: `my-new-paper.bib`

**Minimal required structure:**

```bibtex
@inproceedings{yourcitationkey,
  title = {Your Paper Title},
  author = {First Author and Second Author and ...},
  year = {2024},
  url = {https://example.com/link-to-full-paper},
}
```

---

## ✅ Required Fields

| Field | Description | Example |
|:---|:---|:---|
| `title` | Title of the paper | `{Deconstructing Xen}` |
| `author` | List of authors, separated by `and` | `{John Doe and Jane Smith}` |
| `year` | Year of publication (4 digits) | `{2024}` |
| `url` | Public link to the full paper (PDF or publisher page) | `{https://example.com}` |

---

## ✨ Optional Fields

| Field | Description | Example |
|:---|:---|:---|
| `abstract` | Short description or summary of the paper | `{This paper analyzes...}` |
| `keywords` | Comma-separated tags for search and filtering | `{virtualization, hypervisor, security}` |
| `booktitle` | Conference or journal name (for conference papers) | `{NDSS 2017}` |
| `journal` | Journal name (if published in a journal) | `{IEEE Transactions on Virtualization}` |
| `month` | Month of publication (optional) | `{feb}` |

---

## 📋 Important Notes

- **One paper = one `.bib` file**.
- **Only one entry** per `.bib` file (do not combine multiple entries in one file).
- The **`citation key`** (`@inproceedings{citationkey, ...}`) should be lowercase and descriptive (e.g., `smith2024xenhpc`).
- **Titles and author names should preserve correct capitalization** — BibTeX automatically lowercases unless you protect it with `{}`.
- **URLs must be accessible** (either full text, PDF, or publisher page).
- **Abstracts are welcome** but can be short (2–4 sentences max).
- **Tags (`keywords`) help improve search** and should be general but meaningful.

---

## 🛠️ Validation and CI

When you submit a Merge Request:

- Our CI pipeline automatically parses and validates your `.bib` file.
- If any required fields are missing, or the file cannot be parsed, the pipeline will fail.
- You will see error messages directly in the Merge Request checks.

✅ If everything is correct, your paper will be merged and published automatically!

---

## 📚 Need an Example?

If you're unsure how to format your `.bib` file:

- Check the existing entries inside the [`research/`](.) directory.
- You can copy the structure of any current `.bib` file as a starting point.

Following a working example is the easiest way to get started!

✅ Make sure to update the `citation key`, `title`, `authors`, `year`, and `url` for your paper.

---

## 🛡️ Why This Process?

- ✅ Ensure consistency across all research entries
- ✅ Keep the site searchable and structured
- ✅ Honor academic citation standards
- ✅ Minimize errors during site build

---

## 🙏 Thank You

We appreciate your contribution to documenting and advancing Xen Project research!  
Your paper helps grow our community's understanding and history.

If you have questions, feel free to reach out in your Merge Request or open an issue.

---