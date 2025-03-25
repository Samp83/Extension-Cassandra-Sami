// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const browser = process.env.BROWSER || 'chrome'

const manifestSource = resolve(__dirname, `public/manifest.${browser}.json`)
const manifestDest = resolve(__dirname, 'public/manifest.json')

if (fs.existsSync(manifestSource)) {
  fs.copyFileSync(manifestSource, manifestDest)
  console.log(`✅ Copied ${manifestSource} to ${manifestDest}`)
} else {
  console.warn(`⚠️ Manifest file "${manifestSource}" not found.`)
}

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/contentScript.js')
      },
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name === 'background') return 'background.js'
          if (assetInfo.name === 'content') return 'contentScript.js'
          return '[name].js'
        }
      }
    }
  }
})
