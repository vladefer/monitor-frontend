import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,        // Esto permite que escuche en la red local (0.0.0.0)
    port: 5173         // O el puerto que estés usando
  }
})
