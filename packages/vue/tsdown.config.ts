import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

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
      compotes: 'compotes',
      vue: 'vue',
    },
  },
  // dts: {
  //  vue: true,
  //  },
  plugins: [
    // Vue({
    // isProduction: true,
    // })
  ],
})
