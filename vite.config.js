import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/chat-app',
  //base: '/',
  /* server: {
    proxy: {
      '/chat-server': {
        target: 'https://rapidcollaborate.in/',  // Change this to your Node API server address
        changeOrigin: true,
        secure: false,  // Set to true if you use HTTPS
      },
    },
  }, */
})
