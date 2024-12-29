import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import postcssNesting from 'postcss-nesting'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
      },
    },
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss,
        postcssNesting
      ]
    }
  },
  plugins: [react()]
})