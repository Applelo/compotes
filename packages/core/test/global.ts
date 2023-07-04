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
    rollupOptions: {
      input: {
        drag: resolve(__dirname, './components/drag.html'),
      },
    },
  },
}

export default async () => {
  await build(config)
  await preview(config)
}
