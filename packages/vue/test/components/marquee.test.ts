import { CMarquee } from '@src/components'
import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'
import { cleanupComponent, mountComponent } from './helpers'

it('cMarquee renders root and container classes', async () => {
  const { app, root } = await mountComponent(() =>
    h(CMarquee, { 'data-testid': 'marquee' }, {
      default: () => [
        h('li', 'Item 1'),
        h('li', 'Item 2'),
      ],
    }),
  )

  const marqueeLoc = page.getByTestId('marquee')

  expect(marqueeLoc).toHaveClass(/c-marquee/)
  expect(marqueeLoc.getByRole('list')).toBeVisible()

  await cleanupComponent(app, root)
})
