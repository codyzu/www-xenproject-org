import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { plugin as markdownPlugin } from 'vite-plugin-markdown'
import preact from '@preact/preset-vite';

export default defineConfig({
  base: '/',
  plugins: [
    UnoCSS(),
    UnoCSS({
      mode: 'shadow-dom',
    }),
    markdownPlugin({
      mode: ['html'], // Process Markdown as HTML
      markdownIt: {
        html: true, // Enable HTML in Markdown
      },
    }),
    {
      // We don't want to output the markdown files after unocss has processed them
      name: 'remove-markdown-output',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('.md')) {
          return ''; // Return an empty string to prevent output
        }
      },
    },
    preact(), // Add Preact plugin
  ],
  build: {
    manifest: true,
    outDir: 'themes/xen-project/static',
    rollupOptions: {
      input: {
        'bundle-main': './themes/xen-project/assets/js/vite/bundle-main.js',
        'hardware-status': './themes/xen-project/assets/js/vite/hardware-status.tsx',
        // add more as needed
      },
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'css/[name]-[hash].css',
      },
    },
  },
  publicDir: false,
  // Enforce a strict port so that hugo will know where to find the vite dev server assets
  server: {
    port: 5173,
    strictPort: true,
  },
})