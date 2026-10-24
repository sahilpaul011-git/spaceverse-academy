
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + HashRouter means the build works on GitHub Pages
// (any repo name), Vercel, Netlify, or a plain static host.
export default defineConfig({
  base: './',
  plugins: [react()],
});
