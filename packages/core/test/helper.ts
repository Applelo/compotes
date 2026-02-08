import type { Mock } from 'vitest'
import type { Locator } from 'vitest/browser'
import { vi } from 'vitest'

export function registerEventListeners<T extends string>(eventName: T, locator: Locator): { callback: Mock, removeEventListener: () => void } {
  const callback = vi.fn()
  const el = locator.element()
  el?.addEventListener(eventName, callback)

  const removeEventListener = () => {
    el?.removeEventListener(eventName, callback)
  }

  return {
    callback,
    removeEventListener,
  }
}
