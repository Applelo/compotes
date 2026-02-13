import path from 'node:path'
import Vue from 'unplugin-vue/vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import configShared from './../../vitest.shared'

export default defineConfig(mergeConfig(configShared, {
  plugins: [Vue()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  }))
