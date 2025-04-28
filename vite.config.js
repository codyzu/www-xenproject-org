import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { plugin as markdownPlugin } from 'vite-plugin-markdown'

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
    }
  ],
  build: {
    lib: {
      entry: './themes/xen-project/assets/js/bundle-main.js',
      name: 'MainScript',
      fileName: () => 'bundle-main.js', // Output name
      formats: ['es'], // Output as ES module
    },
    outDir: 'themes/xen-project/static',
    rollupOptions: {
      output: {
        entryFileNames: 'js/bundle.js',
        assetFileNames: 'css/bundle.css',
        manualChunks: undefined, // Disable code splitting
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