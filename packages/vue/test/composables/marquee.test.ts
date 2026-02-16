import { useMarquee } from '@src/composables/marquee'
import { expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'
import { cleanupComposable, mountComposable } from './helpers'

it('useMarquee syncs pause state and actions', async () => {
  const { app, root, composable } = await mountComposable(
    el => h('div', {
      'ref': el,
      'class': 'c-marquee',
      'data-testid': 'marquee',
      'innerHTML': `
        <div class="c-marquee-container">
          <div>Item</div>
        </div>
      `,
    }),
    el => useMarquee(el),
  )

  const locator = page.getByTestId('marquee')
  expect(locator).toBeInTheDocument()
  expect(composable.instance).not.toBeNull()
  expect(composable.isPaused).toBe(false)

  composable.pause()
  await nextTick()
  expect(composable.isPaused).toBe(true)

  composable.play()
  await nextTick()
  expect(composable.isPaused).toBe(false)

  const updateSpy = vi.spyOn(composable.instance!, 'update')
  composable.update(true)
  expect(updateSpy).toHaveBeenCalledWith(true)

  const destroySpy = vi.spyOn(composable.instance!, 'destroy')
  composable.destroy()
  expect(destroySpy).toHaveBeenCalled()

  await cleanupComposable(app, root)
})
