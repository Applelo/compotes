import { CDrilldown, CDrilldownBack, CDrilldownMenu, CDrilldownNext } from '@src/components'
import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'
import { cleanupComponent, mountComponent } from './helpers'

it('cDrilldown renders structure classes', async () => {
  const { app, root } = await mountComponent(() =>
    h(CDrilldown, { 'data-testid': 'drilldown' }, {
      default: () => h(CDrilldownMenu, { 'data-testid': 'menu' }, {
        default: () => [
          h('li', [
            h(CDrilldownNext, { 'data-testid': 'next' }, {
              default: () => 'Next',
            }),
            h(CDrilldownMenu, { 'data-testid': 'submenu' }, {
              default: () => [
                h('li', [
                  h(CDrilldownBack, { 'data-testid': 'back' }, {
                    default: () => 'Back',
                  }),
                ]),
              ],
            }),
          ]),
        ],
      }),
    }),
  )

  const drilldownEl = page.getByTestId('drilldown')
  const menuEl = page.getByTestId('menu')
  const nextEl = page.getByTestId('next')
  const backEl = page.getByTestId('back')

  await expect(drilldownEl).toHaveClass(/c-drilldown/)
  await expect(menuEl).toHaveClass(/c-drilldown-menu/)
  await expect(nextEl).toHaveClass(/c-drilldown-next/)
  await expect(backEl).toHaveClass(/c-drilldown-back/)

  await cleanupComponent(app, root)
})
