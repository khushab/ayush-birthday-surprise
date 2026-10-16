import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from https://khushab.github.io/ayush-birthday-surprise/
  base: '/ayush-birthday-surprise/',
})
