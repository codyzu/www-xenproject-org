import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import bibtexParse from '@orcid/bibtex-parse-js';

const decodeLatexEscapes = (value) => {
  if (!value) return value;

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
  };

  let decoded = value;
  for (const [latex, unicode] of Object.entries(mappings)) {
    decoded = decoded.split(latex).join(unicode);
  }

  decoded = decoded.replaceAll(
    /{\\(["'`^~c])([a-zA-Z])}/g,
    (match, accent, letter) => mappings[`\\${accent}${letter}`] ?? match,
  );
  return decoded.replaceAll(String.raw`{\ss{}}`, 'ß').replaceAll(/{([^{}]+)}/g, '$1');
};

const parsePaper = async (filePath, parseData) => {
  const sourceFile = path.basename(filePath);
  let parsed;

  try {
    parsed = bibtexParse.toJSON(await readFile(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse ${sourceFile}: ${error.message}`, {cause: error});
  }

  if (parsed.length !== 1) {
    throw new Error(`${sourceFile} contains ${parsed.length} BibTeX entries; expected exactly one.`);
  }

  const [{citationKey, entryTags}] = parsed;
  const id = citationKey?.toLowerCase();
  if (!id) throw new Error(`${sourceFile} is missing a citation key.`);

  const data = {
    title: decodeLatexEscapes(entryTags.title),
    authors: entryTags.author?.split(' and ').map((author) => decodeLatexEscapes(author.trim())),
    year: entryTags.year,
    url: entryTags.url || null,
    tags: entryTags.keywords
      ? entryTags.keywords.split(',').map((tag) => decodeLatexEscapes(tag.trim()).toLowerCase())
      : [],
    abstract: entryTags.abstract ? decodeLatexEscapes(entryTags.abstract) : null,
    journal: entryTags.journal
      ? decodeLatexEscapes(entryTags.journal)
      : entryTags.booktitle
        ? decodeLatexEscapes(entryTags.booktitle)
        : null,
    sourceFile,
  };

  return {id, data: await parseData({id, data, filePath})};
};

export function researchLoader() {
  return {
    name: 'xen-research-loader',
    async load(context) {
      const directory = new URL('../../research/', import.meta.url);
      const directoryPath = fileURLToPath(directory);

      const sync = async () => {
        const directoryEntries = await readdir(directory, {withFileTypes: true});
        const files = directoryEntries
          .filter((entry) => entry.isFile() && entry.name.endsWith('.bib'))
          .map((entry) => path.join(directoryPath, entry.name))
          .toSorted();
        const entries = await Promise.all(files.map((file) => parsePaper(file, context.parseData)));
        const ids = new Set();

        for (const {id} of entries) {
          if (ids.has(id)) throw new Error(`Duplicate research citation key: ${id}`);
          ids.add(id);
        }

        context.store.clear();
        for (const entry of entries) context.store.set(entry);
      };

      await sync();
      context.watcher?.add(directoryPath);
      context.watcher?.on('all', async (_event, changedPath) => {
        if (!changedPath.endsWith('.bib')) return;
        try {
          await sync();
          context.logger.info('Reloaded research BibTeX data');
        } catch (error) {
          context.logger.error(error.message);
        }
      });
    },
  };
}
