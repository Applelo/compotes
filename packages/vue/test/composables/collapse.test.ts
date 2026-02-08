import { useCollapse } from '@src/composables/collapse'
import { expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'
import { cleanupComposable, mountComposable } from './helpers'

it('useCollapse syncs state and actions', async () => {
  const { app, root, composable } = await mountComposable(
    el => h('div', {
      'ref': el,
      'id': 'collapse',
      'class': 'c-collapse',
      'data-testid': 'collapse',
    }),
    el => useCollapse(el),
  )

  const locator = page.getByTestId('collapse')
  expect(locator).toBeInTheDocument()
  expect(composable.instance).not.toBeNull()
  expect(composable.isExpanded).toBe(false)

  composable.show()
  await nextTick()
  expect(composable.isExpanded).toBe(true)

  composable.hide()
  await nextTick()
  expect(composable.isExpanded).toBe(false)

  composable.toggle()
  await nextTick()
  expect(composable.isExpanded).toBe(true)

  const updateSpy = vi.spyOn(composable.instance!, 'update')
  composable.update()
  expect(updateSpy).toHaveBeenCalledTimes(1)

  const destroySpy = vi.spyOn(composable.instance!, 'destroy')
  composable.destroy()
  expect(destroySpy).toHaveBeenCalled()

  await cleanupComposable(app, root)
})
