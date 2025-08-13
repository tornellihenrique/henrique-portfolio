import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base is important for GitHub Pages (project pages). Workflow sets VITE_BASE.
  base: process.env.VITE_BASE || '/'
})
