import { resolve } from 'node:path'
import type { InlineConfig } from 'vite'
import { build, preview } from 'vite'

const config: InlineConfig = {
  configFile: false,
  root: resolve(__dirname, './components'),
  publicDir: false,
  build: {
    lib: false,
    outDir: resolve(__dirname, './dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        parent: resolve(__dirname, './components/parent.html'),
        drag: resolve(__dirname, './components/drag.html'),
        collapse: resolve(__dirname, './components/collapse.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, './../src'),
      '@css': resolve(__dirname, './../src/assets/css'),
    },
  },
}

export default async () => {
  await build(config)
  await preview(config)
}
