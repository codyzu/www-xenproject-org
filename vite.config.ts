import {defineConfig} from 'vite';
import unoCSS from 'unocss/vite';
import react from '@vitejs/plugin-react';
import {compression} from 'vite-plugin-compression2';

export default defineConfig({
  base: '/',
  plugins: [
    unoCSS(),
    react(),
    compression({
      algorithm: 'brotliCompress',
      // Ext: '.br',
      // deleteOriginFile: false,
      threshold: 1024,
    } as const),
    // Gzip compression for older browsers
    compression({
      algorithm: 'gzip',
      // Ext: '.gz',
      // deleteOriginFile: false,
      threshold: 1024,
    } as const),
  ],
  build: {
    manifest: true,
    outDir: 'themes/xen-project/static',
    rollupOptions: {
      input: {
        'bundle-main': './themes/xen-project/assets/js/vite/bundle-main.tsx',
      },
      output: {
        entryFileNames: 'js/[name].js',
      },
    },
  },
  publicDir: false,
  // Enforce a strict port so that hugo will know where to find the vite dev server assets
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Complicated regex that determines what should be served by vite.
      // Everything else should be served by Hugo.
      // This includes:
      // - themes/xen-project/assets/js/vite (the vite assets sources)
      // - node_modules
      // - __uno (the uno.css generated styles in dev mode)
      // - @vite (the vite internal assets)
      // - anything that ends with import&raw (used for raw imports in vite)
      // - anything that ends with import&url (used for url imports in vite)
      '^/(?!themes/xen-project/assets/js/vite|node_modules|__uno|@vite|@react-refresh)(?!.*(import&raw|import&url)$).*':
        {
          target: 'http://localhost:1313', // The Hugo server
          changeOrigin: true,
          rewrite: (path) => path,
        },
    },
  },
});
