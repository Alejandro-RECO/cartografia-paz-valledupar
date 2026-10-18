import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // './' permite abrir el build desde cualquier carpeta o subruta (GitHub Pages, USB, etc.)
  base: './',
  // El worker de MapLibre 6 es un módulo ES (importa maplibre-gl-shared.mjs)
  worker: { format: 'es' },
  build: {
    // MapLibre pesa ~1 MB minificado; es esperado
    chunkSizeWarningLimit: 1500,
  },
})
