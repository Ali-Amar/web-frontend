import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import postcssNesting from 'postcss-nesting'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://e-commerce-app-pearl-six.vercel.app',
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