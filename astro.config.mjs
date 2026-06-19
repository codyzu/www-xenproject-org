import {rename, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import {defineConfig} from 'astro/config';
import unoCSS from 'unocss/vite';

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

export default defineConfig({
  integrations: [mdx(), react(), headerFooterOutput],
  outDir: 'dist-astro',
  publicDir: 'static',
  site: 'https://beta.xenproject.org',
  vite: {
    plugins: [unoCSS()],
  },
});
