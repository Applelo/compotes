import { useDropdown } from '@src/composables/dropdown'
import { expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'
import { cleanupComposable, mountComposable } from './helpers'

it('useDropdown syncs open state and actions', async () => {
  const { app, root, composable } = await mountComposable(
    el => h('div', {
      'ref': el,
      'class': 'c-dropdown',
      'data-testid': 'dropdown',
      'innerHTML': `
        <button class="c-dropdown-trigger">Toggle</button>
        <ul class="c-dropdown-container">
          <li><button type="button">Item</button></li>
        </ul>
      `,
    }),
    el => useDropdown(el),
  )

  const locator = page.getByTestId('dropdown')
  expect(locator).toBeInTheDocument()
  expect(composable.instance).not.toBeNull()
  expect(composable.type).toBe('menu')
  expect(composable.isOpen).toBe(false)

  composable.open()
  await nextTick()
  expect(composable.isOpen).toBe(true)

  composable.close()
  await nextTick()
  expect(composable.isOpen).toBe(false)

  composable.toggle()
  await nextTick()
  expect(composable.isOpen).toBe(true)

  const updateSpy = vi.spyOn(composable.instance!, 'update')
  composable.update()
  expect(updateSpy).toHaveBeenCalledTimes(1)

  const equalizeSpy = vi.spyOn(composable.instance!, 'equalizeWidth')
  composable.equalizeWidth()
  expect(equalizeSpy).toHaveBeenCalledTimes(1)

  const destroySpy = vi.spyOn(composable.instance!, 'destroy')
  composable.destroy()
  expect(destroySpy).toHaveBeenCalled()

  await cleanupComposable(app, root)
})
