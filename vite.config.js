import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "github" ? "/Movies4Home/" : "/",
  build: {
    outDir: "dist",
  },
}));
