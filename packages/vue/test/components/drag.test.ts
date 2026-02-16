import { CDrag } from '@src/components'
import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'
import { cleanupComponent, mountComponent } from './helpers'

it('cDrag exposes composable instance and class', async () => {
  let api: any = null

  const { app, root } = await mountComponent(() =>
    h(CDrag, {
      'ref': (el: any) => {
        api = el
      },
      'data-testid': 'drag',
    }, {
      default: () => [
        h('div', { style: 'width: 200px; height: 200px;' }, 'Scrollable content'),
      ],
    }),
  )

  const dragEl = page.getByTestId('drag')
  await expect(dragEl).toHaveClass(/c-drag/)

  await nextTick()
  expect(api.instance).not.toBeNull()

  await cleanupComponent(app, root)
})
