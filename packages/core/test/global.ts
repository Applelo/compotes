import type { InlineConfig } from 'vite'
import { resolve } from 'node:path'
import { build, preview } from 'vite'

const config: InlineConfig = {
  configFile: false,
  root: resolve(__dirname, './components'),
  publicDir: false,
  preview: {
    port: 3000,
  },
  build: {
    lib: false,
    outDir: resolve(__dirname, './dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        collapse: resolve(__dirname, './components/collapse.html'),
        drag: resolve(__dirname, './components/drag.html'),
        dropdown: resolve(__dirname, './components/dropdown.html'),
        drilldown: resolve(__dirname, './components/drilldown.html'),
        marquee: resolve(__dirname, './components/marquee.html'),
        parent: resolve(__dirname, './components/parent.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, './../src'),
      '@css': resolve(__dirname, './../src/css'),
    },
  },
}

export default async (): Promise<void> => {
  await build(config)
  const previewServer = await preview(config)
  previewServer.printUrls()
}
