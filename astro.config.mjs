import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {readFile, readdir, rename, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import {defineConfig} from 'astro/config';
import yaml from 'js-yaml';
import unoCSS from 'unocss/vite';

// Parsing here fails early when CI or a local build provides an invalid origin.
const site = new URL(process.env.SITE_URL ?? 'https://beta.xenproject.org').toString();
const hiddenSitemapPaths = new Set(['/all/', '/headerfooter/']);
const redirectsYaml = readFileSync(new URL('data/redirects.yaml', import.meta.url), 'utf8');
const redirectEntries = yaml.load(redirectsYaml);
const redirectSourcePaths = new Set(Array.isArray(redirectEntries) ? redirectEntries.map(({source}) => source) : []);

const isPublicSitemapPage = (page) => {
  const {pathname} = new URL(page);
  return !pathname.startsWith('/internal/') && !hiddenSitemapPaths.has(pathname) && !redirectSourcePaths.has(pathname);
};

// The Ghost blog served under /blog consumes /headerfooter.html to reuse the
// main site's header, footer, and assets. Astro renders the source page as
// /headerfooter/index.html, so this build hook preserves the legacy flat-file
// URL expected by Ghost and removes the intermediate route directory.
const headerFooterOutput = {
  name: 'header-footer-output',
  hooks: {
    async 'astro:build:done'({dir}) {
      const source = fileURLToPath(new URL('headerfooter/index.html', dir));
      const destination = fileURLToPath(new URL('headerfooter.html', dir));
      await rename(source, destination);
      await rm(fileURLToPath(new URL('headerfooter/', dir)), {recursive: true, force: true});
    },
  },
};

// The Ghost blog fetches this stable fragment and injects #block-assets into
// its document. Keep the fragment stable while pointing it at cache-busted
// Astro assets.
const ghostHeaderFooterAssets = {
  name: 'ghost-header-footer-assets',
  hooks: {
    async 'astro:build:done'({dir}) {
      const astroDirectory = fileURLToPath(new URL('_astro/', dir));
      const files = await readdir(astroDirectory);
      const legacyLayoutCss = files.find((file) => /^LegacyLayout\..+\.css$/.test(file));

      if (!legacyLayoutCss) {
        throw new Error('Unable to find Astro LegacyLayout CSS for the Ghost header/footer fragment.');
      }

      const menuScript = await readFile(new URL('src/scripts/menu.js', import.meta.url), 'utf8');
      const animateScript = await readFile(new URL('src/scripts/animate.js', import.meta.url), 'utf8');
      const blogShellScript = `${menuScript}\n${animateScript}`;
      const blogShellHash = createHash('sha256').update(blogShellScript).digest('hex').slice(0, 10);
      const blogShellFile = `blog-shell.${blogShellHash}.js`;
      await writeFile(fileURLToPath(new URL(`_astro/${blogShellFile}`, dir)), blogShellScript);

      const headerFooterPath = fileURLToPath(new URL('headerfooter.html', dir));
      const headerFooter = await readFile(headerFooterPath, 'utf8');
      const assets = [
        `<link rel="stylesheet" href="/_astro/${legacyLayoutCss}">`,
        `<script src="/_astro/${blogShellFile}" defer></script>`,
      ].join(' ');

      await writeFile(
        headerFooterPath,
        headerFooter.replace('<div id="block-assets">', `<div id="block-assets"> ${assets}`),
      );
    },
  },
};

const ghostMockApi = {
  name: 'ghost-mock-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const requestUrl = new URL(request.url ?? '/', 'http://localhost');
      if (requestUrl.pathname !== '/blog/ghost/api/content/posts/') {
        next();
        return;
      }

      const fixture = await readFile(new URL('data/ghost-posts.fixture.json', import.meta.url), 'utf8');
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.end(fixture);
    });
  },
};

export default defineConfig({
  integrations: [
    astroExpressiveCode(),
    mdx(),
    react(),
    sitemap({filter: isPublicSitemapPage}),
    headerFooterOutput,
    ghostHeaderFooterAssets,
  ],
  site,
  vite: {
    plugins: [unoCSS(), ghostMockApi],
  },
});
