import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import configShared from './../../vitest.shared'

export default defineConfig(mergeConfig(configShared, {
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@css': path.resolve(__dirname, './src/css'),
    },
  },
}))
