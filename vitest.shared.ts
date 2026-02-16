import type { UserConfig } from 'vite'
import { playwright } from '@vitest/browser-playwright'

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
      reporter: ['lcov', 'html', 'text'],
    },
  },
} as UserConfig
