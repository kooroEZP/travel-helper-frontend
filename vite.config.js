import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8005', // python
        // target: 'http://localhost:8080', // java
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
