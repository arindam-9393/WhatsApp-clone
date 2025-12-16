import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // <--- IMPORT THIS

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(), // <--- ADD THIS FUNCTION HERE
  ],
  define: {
    // This handles the "global" error if it still persists
    global: 'window', 
  }
})