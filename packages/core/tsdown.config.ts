import type { Plugin } from 'rolldown'
import { promises as fs } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { transform } from 'lightningcss'
import { defineConfig } from 'tsdown'
import LightningCSS from 'unplugin-lightningcss/rolldown'

const root = fileURLToPath(new URL('.', import.meta.url))

function addCSSCompotes(): Plugin {
  return {
    name: 'add-css',
    async generateBundle() {
      const styles = await fg.glob(['src/css/*.css'], { cwd: root })
      for (const path of styles) {
        const filename = basename(path)
        const css = await fs.readFile(resolve(root, path))
        const { code } = transform({
          filename,
          code: css,
          minify: true,
        })
        this.emitFile({
          source: code,
          fileName: `css/${filename}`,
          type: 'asset',
        })
      }
    },
  }
}

export default defineConfig({
  entry: {
    compotes: './src/index.ts',
  },
  format: ['esm', 'umd'],
  platform: 'browser',
  globalName: 'compotes',
  outputOptions: {
    globals: {
      tabbable: 'tabbable',
    },
  },
  fixedExtension: true,
  outExtensions: ({ format }) => {
    if (format === 'umd')
      return { js: '.cjs', dts: '.d.cts' }
  },
  hash: false,
  alias: {
    '@src': resolve(root, 'src'),
  },
  css: {
    splitting: false,
    fileName: 'style.css',
  },
  dts: true,
  onSuccess: async () => {
    await fs.copyFile(resolve(root, 'dist/compotes.d.mts'), resolve(root, 'dist/compotes.d.cts'))
  },
  plugins: [LightningCSS({
    options: {
      minify: true,
    },
  }), addCSSCompotes()],
})
