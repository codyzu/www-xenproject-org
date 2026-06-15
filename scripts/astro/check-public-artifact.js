import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {load} from 'cheerio';

const publicDirectory = path.resolve('public');
const internalHosts = new Set(['beta.xenproject.org']);
const delegatedInternalPaths = [
  // The project blog is deployed outside this static-site artifact.
  /^\/blog(?:\/|$)/,
];
const ignoredProtocols = new Set(['mailto:', 'tel:', 'javascript:', 'data:']);
const htmlAttributes = [
  ['a', 'href', 'link'],
  ['area', 'href', 'link'],
  ['img', 'src', 'asset'],
  ['script', 'src', 'asset'],
  ['link', 'href', 'asset'],
  ['source', 'src', 'asset'],
  ['video', 'src', 'asset'],
  ['audio', 'src', 'asset'],
  ['iframe', 'src', 'asset'],
];

const errors = [];

const addError = (filePath, message) => {
  errors.push(`${path.relative(process.cwd(), filePath)}: ${message}`);
};

const isHtmlFile = filePath => filePath.endsWith('.html');

const walk = directory => {
  const entries = fs.readdirSync(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
};

const stripHashAndSearch = value => value.split('#')[0].split('?')[0];

const normalizeUrl = (rawValue, filePath) => {
  const value = rawValue.trim();

  if (!value || value.startsWith('#')) {
    return;
  }

  let url;

  try {
    url = value.startsWith('/')
      ? new URL(value, 'https://beta.xenproject.org')
      : new URL(value, `https://beta.xenproject.org${routePathForFile(filePath)}`);
  } catch {
    addError(filePath, `invalid URL "${value}"`);
    return;
  }

  if (ignoredProtocols.has(url.protocol)) {
    return;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  if (!internalHosts.has(url.host)) {
    return;
  }

  return stripHashAndSearch(url.pathname);
};

const routePathForFile = filePath => {
  const relative = path.relative(publicDirectory, filePath);

  if (relative === 'index.html') {
    return '/';
  }

  if (relative.endsWith('/index.html')) {
    return `/${relative.slice(0, -'index.html'.length)}`;
  }

  return `/${relative}`;
};

const localPathCandidates = pathname => {
  const decodedPathname = decodeURIComponent(pathname);
  const normalizedPathname = decodedPathname.replace(/^\/+/, '');
  const directPath = path.join(publicDirectory, normalizedPathname);

  if (path.extname(normalizedPathname)) {
    return [directPath];
  }

  return [
    directPath,
    path.join(directPath, 'index.html'),
    `${directPath}.html`,
  ];
};

const localPathExists = pathname =>
  localPathCandidates(pathname).some(candidate => fs.existsSync(candidate));

const assertLocalTargetExists = (filePath, rawValue, kind) => {
  const pathname = normalizeUrl(rawValue, filePath);

  if (!pathname) {
    return;
  }

  if (delegatedInternalPaths.some(pattern => pattern.test(pathname))) {
    return;
  }

  if (!localPathExists(pathname)) {
    addError(filePath, `missing internal ${kind} target "${rawValue}"`);
  }
};

const assertCanonical = (filePath, $) => {
  if (path.basename(filePath) === 'headerfooter.html') {
    return;
  }

  const canonical = $('link[rel="canonical"]').attr('href');
  const refresh = $('meta[http-equiv="refresh" i]').attr('content');

  if (refresh) {
    return;
  }

  if (!canonical) {
    addError(filePath, 'missing canonical URL');
    return;
  }

  try {
    const canonicalUrl = new URL(canonical);

    if (canonicalUrl.protocol !== 'https:') {
      addError(filePath, `canonical URL must use https: "${canonical}"`);
    }
  } catch {
    addError(filePath, `invalid canonical URL "${canonical}"`);
  }
};

const assertRedirect = (filePath, $) => {
  const refresh = $('meta[http-equiv="refresh" i]').attr('content');
  const script = $('script')
    .toArray()
    .map(element => $(element).text())
    .join('\n');

  if (!refresh && !/location\s*=/.test(script)) {
    return;
  }

  const refreshTarget = refresh?.match(/url=(?<target>.+)$/i)?.groups?.target.trim();
  const linkTarget = $('a[href]').first().attr('href');
  const target = refreshTarget ?? linkTarget;

  if (!target) {
    addError(filePath, 'redirect page is missing a target URL');
    return;
  }

  assertLocalTargetExists(filePath, target, 'redirect');
};

if (!fs.existsSync(publicDirectory)) {
  throw new Error('public/ does not exist. Run npm run build:astro-spike first.');
}

if (!fs.existsSync(path.join(publicDirectory, '404.html'))) {
  errors.push('public/404.html: missing generated 404 page');
}

const htmlFiles = walk(publicDirectory).filter(isHtmlFile);

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = load(html);

  for (const [selector, attribute, kind] of htmlAttributes) {
    for (const element of $(selector).toArray()) {
      const rawValue = $(element).attr(attribute);

      if (rawValue) {
        assertLocalTargetExists(filePath, rawValue, kind);
      }
    }
  }

  for (const element of $('[srcset]').toArray()) {
    const srcset = $(element).attr('srcset');

    for (const item of srcset.split(',')) {
      const [rawValue] = item.trim().split(/\s+/);

      if (rawValue) {
        assertLocalTargetExists(filePath, rawValue, 'asset');
      }
    }
  }

  assertCanonical(filePath, $);
  assertRedirect(filePath, $);
}

if (errors.length > 0) {
  console.error(`Public artifact check failed with ${errors.length} issue(s):`);

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log(`Public artifact check passed for ${htmlFiles.length} HTML file(s).`);
}
