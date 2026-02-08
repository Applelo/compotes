import { useDrag } from '@src/composables/drag'
import { expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'
import { cleanupComposable, mountComposable } from './helpers'

it('useDrag syncs state and events', async () => {
  const { app, root, el, composable } = await mountComposable(
    refEl => h('div', {
      'ref': refEl,
      'class': 'c-drag',
      'style': 'width:100px;height:100px;overflow:auto;',
      'data-testid': 'drag',
    }, [
      h('div', { style: 'width:200px;height:200px;' }),
    ]),
    refEl => useDrag(refEl),
  )

  const locator = page.getByTestId('drag')
  expect(locator).toBeInTheDocument()
  expect(composable.instance).not.toBeNull()

  expect(composable.isDraggable).toBe(composable.instance!.isDraggable)
  expect(composable.isDragging).toBe(false)

  el.value?.dispatchEvent(new CustomEvent('c.drag.start'))
  await nextTick()
  expect(composable.isDragging).toBe(true)

  el.value?.dispatchEvent(new CustomEvent('c.drag.end'))
  await nextTick()
  expect(composable.isDragging).toBe(false)

  const destroySpy = vi.spyOn(composable.instance!, 'destroy')
  composable.destroy()
  expect(destroySpy).toHaveBeenCalled()

  await cleanupComposable(app, root)
})
