#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import bibtexParse from '@orcid/bibtex-parse-js';
import chalk from 'chalk';
import {z} from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const bibDir = path.resolve(__dirname, '../../research');
const dataOutput = path.resolve(__dirname, '../../data/research.json');

// Validation schema
const schema = z.object({
  citationKey: z.string(),
  entryType: z.string(),
  entryTags: z.object({
    title: z.string(),
    author: z.string(),
    year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit year'),
    url: z.string().url().optional(),
    keywords: z.string().optional(),
    abstract: z.string().optional(),
    journal: z.string().optional(),
    booktitle: z.string().optional(),
  }),
});

// Read all .bib files
const files = fs.readdirSync(bibDir).filter((f) => f.endsWith('.bib'));

const papers = [];
let failed = false;

for (const file of files) {
  const filePath = path.join(bibDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;

  try {
    parsed = bibtexParse.toJSON(raw);
  } catch (error) {
    console.error(chalk.red(`❌ Failed to parse ${file}: ${error.message}`));
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

  const {citationKey, entryTags} = validation.data;
  const id = citationKey.toLowerCase();
  const title = decodeLatexEscapes(entryTags.title);
  const authors = entryTags.author.split(' and ').map((a) => decodeLatexEscapes(a.trim()));
  const {year} = entryTags;
  const tags = entryTags.keywords
    ? entryTags.keywords.split(',').map((t) => decodeLatexEscapes(t.trim()).toLowerCase())
    : [];

  // Default to null for missing fields
  const abstract = entryTags.abstract ? decodeLatexEscapes(entryTags.abstract) : null;
  const journal = entryTags.journal
    ? decodeLatexEscapes(entryTags.journal)
    : entryTags.booktitle
      ? decodeLatexEscapes(entryTags.booktitle)
      : null;
  const url = entryTags.url || null;

  const paper = {
    id,
    title,
    authors,
    year,
    url,
    tags,
    abstract,
    journal,
    sourceFile: file,
  };

  papers.push(paper);
}

// Write papers.json
fs.mkdirSync(path.dirname(dataOutput), {recursive: true});
fs.writeFileSync(dataOutput, JSON.stringify(papers, null, 2));
console.log(chalk.blue(`📦 Wrote: ${dataOutput}`));

// Fail CI if anything went wrong
if (failed) {
  console.error(chalk.bgRed.white(`\n❌ Some files failed parsing or validation.`));
  process.exit(1);
}

console.log(chalk.bgGreen.black(`\n✅ All BibTeX files parsed and exported successfully.`));

// Can't find a package to do this, so we do it manually in order to support escaped accents
function decodeLatexEscapes(string_) {
  if (!string_) {
    return string_;
  }

  const mappings = {
    '\\"a': 'ä',
    '\\"e': 'ë',
    '\\"i': 'ï',
    '\\"o': 'ö',
    '\\"u': 'ü',
    '\\"A': 'Ä',
    '\\"E': 'Ë',
    '\\"I': 'Ï',
    '\\"O': 'Ö',
    '\\"U': 'Ü',
    "\\'a": 'á',
    "\\'e": 'é',
    "\\'i": 'í',
    "\\'o": 'ó',
    "\\'u": 'ú',
    "\\'A": 'Á',
    "\\'E": 'É',
    "\\'I": 'Í',
    "\\'O": 'Ó',
    "\\'U": 'Ú',
    '\\`a': 'à',
    '\\`e': 'è',
    '\\`i': 'ì',
    '\\`o': 'ò',
    '\\`u': 'ù',
    '\\`A': 'À',
    '\\`E': 'È',
    '\\`I': 'Ì',
    '\\`O': 'Ò',
    '\\`U': 'Ù',
    '\\~n': 'ñ',
    '\\~N': 'Ñ',
    '\\c{c}': 'ç',
    '\\c{C}': 'Ç',
    '\\^a': 'â',
    '\\^e': 'ê',
    '\\^i': 'î',
    '\\^o': 'ô',
    '\\^u': 'û',
    '\\^A': 'Â',
    '\\^E': 'Ê',
    '\\^I': 'Î',
    '\\^O': 'Ô',
    '\\^U': 'Û',
    '\\ss{}': 'ß',
    // Add more mappings if you encounter new cases!
  };

  let unescaped = string_;

  // Replace known mappings
  for (const [latex, unicode] of Object.entries(mappings)) {
    unescaped = unescaped.split(latex).join(unicode);
  }

  // Handle wrapped braces around single character escapes like {\"e}
  unescaped = unescaped.replaceAll(/{\\(["'`^~c])([a-zA-Z])}/g, (match, accent, letter) => {
    const lookup = `\\${accent}${letter}`;
    return mappings[lookup] || match;
  });

  // Handle special {ss} case (ß)
  unescaped = unescaped.replaceAll(String.raw`{\ss{}}`, 'ß');

  // Remove leftover simple { } wrapping (non-math)
  unescaped = unescaped.replaceAll(/{([^{}]+)}/g, '$1');

  return unescaped;
}
