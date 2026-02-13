import { playwright } from '@vitest/browser-playwright'
import { UserConfig } from 'vite'

export default {
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
      include: ['src/**/*.ts'],
      reporter: ['lcov', 'html'],
    },
  },
} as UserConfig

