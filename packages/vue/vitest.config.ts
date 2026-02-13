import path from 'node:path'
import { playwright } from '@vitest/browser-playwright'
import Vue from 'unplugin-vue/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [
        { browser: 'chromium' },
        { browser: 'firefox' },
        { browser: 'webkit' },
      ],
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{ts,vue}'],
      reporter: ['lcov', 'html'],
    },
  },
})
