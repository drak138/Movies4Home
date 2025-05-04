import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({
  plugins: [react()],
  base:"/Movies4Home",
  build: {
    outDir: "dist",
  },
  optimizeDeps: {
    include: ['js-cookie'],
  },
}));
