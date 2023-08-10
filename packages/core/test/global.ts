import { resolve } from 'node:path'
import type { InlineConfig } from 'vite'
import { createServer } from 'vite'

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
        collapse: resolve(__dirname, './components/collapse.html'),
        drag: resolve(__dirname, './components/drag.html'),
        drilldown: resolve(__dirname, './components/drilldown.html'),
        parent: resolve(__dirname, './components/parent.html'),
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
  const server = await createServer(config)
  await server.listen()
  // server.printUrls()
}
