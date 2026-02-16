import { copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  entry: {
    compotes: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
  },
  format: ['esm', 'umd'],
  platform: 'neutral',
  globalName: 'compotes',
  fixedExtension: true,
  outExtensions: ({ format }) => {
    if (format === 'umd')
      return { js: '.cjs', dts: '.d.cts' }
  },
  hash: false,
  alias: {
    '@src': fileURLToPath(new URL('./src', import.meta.url)),
  },
  outputOptions: {
    globals: {
      'compotes': 'compotes',
      'vue': 'vue',
      'compotes/css/collapse': 'compotes_css_collapse',
      'compotes/css/drag': 'compotes_css_drag',
      'compotes/css/drilldown': 'compotes_css_drilldown',
      'compotes/css/dropdown': 'compotes_css_dropdown',
      'compotes/css/marquee': 'compotes_css_marquee',
    },
  },
  dts: {
    vue: true,
  },
  onSuccess: async () => {
    await copyFile(`${root}dist/compotes.d.mts`, `${root}dist/compotes.d.cts`)
  },
  plugins: [
    Vue({
      isProduction: true,
    }),
  ],
})
