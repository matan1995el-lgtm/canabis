import { defineConfig } from 'vite';

// Vite acts purely as a static wrapper around the existing single-file app
// (index.html). The app ships its own CDN scripts and inline JS — nothing to
// bundle, transform, or polyfill. build.copyPublicDir stays true so docs/ and
// scripts/ ride along unchanged.
export default defineConfig({
  server: { hmr: false },
  build: {
    outDir: 'dist',
    copyPublicDir: true
  }
});
