import { useDrilldown } from '@src/composables/drilldown'
import { expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'
import { cleanupComposable, mountComposable } from './helpers'

it('useDrilldown exposes instance actions', async () => {
  const { app, root, composable } = await mountComposable(
    el => h('nav', {
      'ref': el,
      'class': 'c-drilldown',
      'data-testid': 'drilldown',
      'innerHTML': `
        <ul class="c-drilldown-menu">
          <li>
            <button class="c-drilldown-next">Next</button>
            <ul class="c-drilldown-menu">
              <li>
                <button class="c-drilldown-back">Back</button>
              </li>
            </ul>
          </li>
        </ul>
      `,
    }),
    el => useDrilldown(el),
  )

  const locator = page.getByTestId('drilldown')
  expect(locator).toBeInTheDocument()
  expect(composable.instance).not.toBeNull()

  const updateSpy = vi.spyOn(composable.instance!, 'update')
  composable.update(true)
  expect(updateSpy).toHaveBeenCalledWith(true)

  const backSpy = vi.spyOn(composable.instance!, 'back')
  composable.back()
  expect(backSpy).toHaveBeenCalled()

  const resetSpy = vi.spyOn(composable.instance!, 'reset')
  composable.reset()
  expect(resetSpy).toHaveBeenCalled()

  const destroySpy = vi.spyOn(composable.instance!, 'destroy')
  composable.destroy()
  expect(destroySpy).toHaveBeenCalled()

  await cleanupComposable(app, root)
})
