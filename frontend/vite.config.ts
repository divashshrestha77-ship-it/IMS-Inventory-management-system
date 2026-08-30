import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ims-r9e5.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/product': {
        target: 'https://ims-r9e5.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/inventory': {
        target: 'https://ims-r9e5.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
