import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    // public/assets/ (resume, decks, docs) is served from dist/assets/ verbatim, so
    // keep Vite's own hashed build output in a separate directory to avoid collisions.
    assetsDir: 'build-assets',
  },
});
