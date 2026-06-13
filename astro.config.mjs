import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import {defineConfig} from 'astro/config';
import unoCSS from 'unocss/vite';

export default defineConfig({
  integrations: [mdx(), react()],
  outDir: 'dist-astro',
  publicDir: 'static',
  site: 'https://beta.xenproject.org',
  vite: {
    plugins: [unoCSS()],
  },
});
