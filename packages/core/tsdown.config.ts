import { promises as fs } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { transform } from 'lightningcss'
import { defineConfig } from 'tsdown'
import LightningCSS from 'unplugin-lightningcss/rolldown'

const root = fileURLToPath(new URL('.', import.meta.url))

function addCSSCompotes() {
  return {
    name: 'add-css',
    async generateBundle() {
      const styles = await fg.glob(['src/css/*.css'], { cwd: root })
      const minifyStyle = async (path: string) => {
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
      await Promise.all(styles.map(path => minifyStyle(path)))
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
  hash: false,
  alias: {
    '@src': resolve(root, 'src'),
  },
  css: {
    splitting: false,
    fileName: 'compotes.css',
  },
  dts: true,
  plugins: [LightningCSS({
    options: {
      minify: true,
    },
  }), addCSSCompotes()],
})
