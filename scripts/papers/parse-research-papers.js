import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bibtexParse from '@orcid/bibtex-parse-js';
import chalk from 'chalk';
import { z } from 'zod';

// Support __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const bibDir = path.resolve(__dirname, '../../research');
const dataOutput = path.resolve(__dirname, '../../data/papers.json');
const contentOutputDir = path.resolve(__dirname, '../../content/papers');

// Validation schema
const schema = z.object({
  citationKey: z.string(),
  entryType: z.string(),
  entryTags: z.object({
    title: z.string(),
    author: z.string(),
    year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit year"),
    url: z.string().url().optional(),
    keywords: z.string().optional(),
    abstract: z.string().optional(),
    journal: z.string().optional(),
    booktitle: z.string().optional()
  })
});

// Read all .bib files
const files = fs.readdirSync(bibDir).filter(f => f.endsWith('.bib'));

const papers = [];
let failed = false;

for (const file of files) {
  const filePath = path.join(bibDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;

  try {
    parsed = bibtexParse.toJSON(raw);
  } catch (err) {
    console.error(chalk.red(`❌ Failed to parse ${file}: ${err.message}`));
    failed = true;
    continue;
  }

  if (parsed.length !== 1) {
    console.warn(chalk.yellow(`⚠️ ${file} contains ${parsed.length} entries (expected 1)`));
    failed = true;
    continue;
  }

  const [entry] = parsed;
  const validation = schema.safeParse(entry);

  if (!validation.success) {
    console.error(chalk.red(`❌ Validation failed for ${file}:`));
    console.error(chalk.gray(JSON.stringify(validation.error.format(), null, 2)));
    failed = true;
    continue;
  }

  const { citationKey, entryTags } = validation.data;
  const id = citationKey.toLowerCase();
  const authors = entryTags.author.split(' and ').map(a => a.trim());
  const tags = entryTags.keywords?.split(',').map(t => t.trim().toLowerCase()) || [];
  const paper = {
    id,
    title: entryTags.title,
    authors,
    year: entryTags.year,
    url: entryTags.url || null,
    tags,
    abstract: entryTags.abstract || null,
    journal: entryTags.journal || entryTags.booktitle || null,
    source_file: file
  };

  papers.push(paper);

  // Generate .md file for Hugo
  const mdContent = `---
title: "${paper.title.replace(/"/g, '\\"')}"
paper_id: "${id}"
date: ${paper.year}-01-01
draft: false
---

<!-- Paper page generated from ${file} -->
`;

  fs.mkdirSync(contentOutputDir, { recursive: true });
  const mdPath = path.join(contentOutputDir, `${id}.md`);
  fs.writeFileSync(mdPath, mdContent);
  console.log(chalk.green(`✅ Wrote: ${mdPath}`));
}

// Write papers.json
fs.mkdirSync(path.dirname(dataOutput), { recursive: true });
fs.writeFileSync(dataOutput, JSON.stringify(papers, null, 2));
console.log(chalk.blue(`📦 Wrote: ${dataOutput}`));

// Fail CI if anything went wrong
if (failed) {
  console.error(chalk.bgRed.white(`\n❌ Some files failed parsing or validation.`));
  process.exit(1);
}

console.log(chalk.bgGreen.black(`\n✅ All BibTeX files parsed and exported successfully.`));