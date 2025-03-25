// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // main UI
        index: resolve(__dirname, 'index.html'),
        

        // background & content scripts
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/contentScript.js'),
        
      },
      output: {
        entryFileNames: assetInfo => {
          // name background and content properly for manifest.json
          if (assetInfo.name === 'background') return 'background.js'
          if (assetInfo.name === 'content') return 'contentScript.js'
          return '[name].js'
        }
      }
    }
  }
})
