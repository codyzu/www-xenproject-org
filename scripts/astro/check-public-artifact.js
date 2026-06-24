import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {load} from 'cheerio';
import {migratedRoutes, migratedRedirectRoutes} from './migrated-routes.ts';

const outputArgument = process.argv.find((argument) => !argument.startsWith('--') && argument !== process.argv[0] && argument !== process.argv[1]);
const standalone = process.argv.includes('--standalone');
const publicDirectory = path.resolve(outputArgument ?? 'public');
const expectedSite = new URL(process.env.SITE_URL ?? 'https://beta.xenproject.org');
const internalHosts = new Set([expectedSite.host]);
const delegatedInternalPaths = [
  // The project blog is deployed outside this static-site artifact.
  /^\/blog(?:\/|$)/,
  // Historical WordPress uploads are hosted independently from this artifact.
  /^\/wp-content\/uploads(?:\/|$)/,
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
      ? new URL(value, expectedSite)
      : new URL(value, new URL(routePathForFile(filePath), expectedSite));
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

    if (canonicalUrl.origin !== expectedSite.origin) {
      addError(filePath, `canonical URL must use configured site origin "${expectedSite.origin}": "${canonical}"`);
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
  throw new Error(`${path.relative(process.cwd(), publicDirectory)}/ does not exist. Build the target artifact first.`);
}

if (!fs.existsSync(path.join(publicDirectory, '404.html'))) {
  errors.push(`${path.relative(process.cwd(), path.join(publicDirectory, '404.html'))}: missing generated 404 page`);
}

const htmlFiles = walk(publicDirectory).filter(isHtmlFile);

if (standalone) {
  const routeFile = route => route === '/' ? 'index.html' : `${route.replace(/^\//, '')}index.html`;
  const expectedHtml = new Set([
    ...migratedRoutes.map(routeFile),
    ...migratedRedirectRoutes.map(routeFile),
    '404.html',
    'all/index.html',
    'headerfooter.html',
    'internal/design-system/index.html',
  ]);
  const actualHtml = new Set(htmlFiles.map(filePath => path.relative(publicDirectory, filePath)));

  for (const expected of expectedHtml) {
    if (!actualHtml.has(expected)) {
      errors.push(`${expected}: missing expected standalone output`);
    }
  }

  for (const actual of actualHtml) {
    if (!expectedHtml.has(actual)) {
      errors.push(`${actual}: unexpected standalone HTML output`);
    }
  }

  for (const retired of ['categories/index.html', 'tags/index.html']) {
    if (actualHtml.has(retired)) {
      errors.push(`${retired}: retired taxonomy output must not be generated`);
    }
  }

  const headerFooterPath = path.join(publicDirectory, 'headerfooter.html');
  if (fs.existsSync(headerFooterPath)) {
    const fragment = fs.readFileSync(headerFooterPath, 'utf8');
    const $fragment = load(fragment, null, false);
    for (const id of ['block-assets', 'block-header', 'block-footer']) {
      if ($fragment(`#${id}`).length !== 1) {
        errors.push(`headerfooter.html: expected exactly one #${id}`);
      }
    }

    if (/<(?:html|body)(?:\s|>)/i.test(fragment)) {
      errors.push('headerfooter.html: fragment must not contain html or body wrappers');
    }

    if ($fragment('link[href^="/_astro/LegacyLayout."][href$=".css"]').length !== 1) {
      errors.push('headerfooter.html: missing cache-busted Astro stylesheet link');
    }

    if ($fragment('script[src^="/_astro/blog-shell."][src$=".js"]').length !== 1) {
      errors.push('headerfooter.html: missing cache-busted blog shell script link');
    }
  }

  const rssPath = path.join(publicDirectory, 'index.xml');
  if (!fs.existsSync(rssPath)) {
    errors.push('index.xml: missing RSS output');
  } else {
    const rssXml = fs.readFileSync(rssPath, 'utf8');
    const $rss = load(rssXml, {xmlMode: true});
    const items = $rss('channel > item').toArray();
    const links = items.map(item => $rss(item).find('link').text());
    const dates = items.map(item => Date.parse($rss(item).find('pubDate').text()));

    if ($rss('channel > title').first().text() !== 'Xen Project' || $rss('channel > language').text() !== 'en-us') {
      errors.push('index.xml: RSS channel metadata does not match the site contract');
    }

    if (!links.some(link => link.includes('/research/')) || !links.some(link => link.includes('/resources/past-events/'))) {
      errors.push('index.xml: RSS must contain at least one research item and one event item');
    }

    if (dates.some(Number.isNaN) || dates.some((date, index) => index > 0 && date > dates[index - 1])) {
      errors.push('index.xml: RSS items must have valid dates in descending order');
    }

    if (links.some(link => !link.startsWith('https://'))) {
      errors.push('index.xml: RSS item links must be absolute HTTPS URLs');
    }

    if (links.some(link => new URL(link).origin !== expectedSite.origin)) {
      errors.push(`index.xml: RSS item links must use configured site origin "${expectedSite.origin}"`);
    }
  }

}

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
  console.log(`${path.relative(process.cwd(), publicDirectory)}/ artifact check passed for ${htmlFiles.length} HTML file(s).`);
}
