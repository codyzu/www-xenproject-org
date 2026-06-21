import {readFile, rename, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import {defineConfig} from 'astro/config';
import unoCSS from 'unocss/vite';

// Parsing here fails early when CI or a local build provides an invalid origin.
const site = new URL(process.env.SITE_URL ?? 'https://beta.xenproject.org').toString();

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
  integrations: [mdx(), react(), headerFooterOutput],
  outDir: 'public',
  publicDir: 'static',
  site,
  vite: {
    plugins: [unoCSS(), ghostMockApi],
  },
});
