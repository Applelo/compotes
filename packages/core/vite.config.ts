import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'compotes',
      fileName: 'compotes',
    },
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
  publicDir: './src/assets',
  plugins: [dts()],
  test: {
    globalSetup: './test/global.ts',
  },
})
