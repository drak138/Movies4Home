import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    "base": "/Movies4Home/",
    "homepage": "http://.github.io/Movies4Home/"
})
