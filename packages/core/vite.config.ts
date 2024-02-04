/// <reference types="vitest" />

import { basename, resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { promises as fs } from 'node:fs'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { transform } from 'lightningcss'
import fg from 'fast-glob'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'compotes',
      fileName: 'compotes',
    },
    cssMinify: 'lightningcss',
    rollupOptions: {
      external: ['tabbable'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          tabbable: 'tabbable',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
      '@css': resolve(__dirname, './src/css'),
    },
  },
  plugins: [dts({
    exclude: ['node_modules/**', 'test/**'],
  }), {
    name: 'minifyCSS',
    enforce: 'post',
    async buildEnd() {
      const styles = await fg.glob(['src/css/*.css'])
      const minifyStyle = async (path: string) => {
        const filename = basename(path)
        const css = await fs.readFile(resolve(__dirname, path))
        const { code } = transform({
          filename,
          code: Buffer.from(css),
          minify: true,
          sourceMap: false,
        })
        this.emitFile({
          needsCodeReference: false,
          source: code,
          fileName: `css/${filename}`,
          type: 'asset',
        })
      }

      const promises: Promise<void>[] = []
      styles.forEach(path => promises.push(minifyStyle(path)))
      await Promise.all(promises)
    },
  }],
  test: {
    globalSetup: './test/global.ts',
  },
})
