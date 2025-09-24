import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure base is set to root
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://projectmanagement-pop4.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})