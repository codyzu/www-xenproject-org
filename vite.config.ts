import {defineConfig} from 'vite';
import unoCSS from 'unocss/vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: '/',
  plugins: [unoCSS(), preact()],
  build: {
    manifest: true,
    outDir: 'themes/xen-project/static',
    rollupOptions: {
      input: {
        'bundle-main': './themes/xen-project/assets/js/vite/bundle-main.tsx',
        'hardware-status': './themes/xen-project/assets/js/vite/hardware-status.tsx',
      },
      output: {
        manualChunks: {
          // Split out the vendor code into separate chunks
          preact: ['preact', 'preact/hooks'],
        },
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
  resolve: {
    // Ensure preact is only bundled once
    dedupe: ['preact', 'preact/hooks'],
  },
});
