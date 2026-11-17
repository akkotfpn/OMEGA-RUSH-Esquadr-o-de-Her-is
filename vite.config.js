import { defineConfig } from 'vite';

// base relativa: o mesmo build funciona no APK (Capacitor) e no GitHub Pages (subpasta)
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
  },
});
