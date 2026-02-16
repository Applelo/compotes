import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: {
    compotes: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
  },
  format: ['esm', 'umd'],
  platform: 'neutral',
  globalName: 'compotes',
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
  plugins: [
    Vue({
      isProduction: true,
    }),
  ],
})
