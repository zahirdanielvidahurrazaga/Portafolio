import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // El chunk de three.js (cinta 3D del hero, ~560 KB / ~140 KB gzip) se carga
    // con import() después de pintar; no bloquea la primera carga.
    chunkSizeWarningLimit: 600,
  },
})
