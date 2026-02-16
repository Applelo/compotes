import { CDropdown, CDropdownMenu, CDropdownTrigger } from '@src/components'
import { expect, it } from 'vitest'
import { h } from 'vue'
import { cleanupComponent, mountComponent } from './helpers'

it('cDropdown wires trigger to menu id', async () => {
  const { app, root } = await mountComponent(() =>
    h(CDropdown, { 'data-testid': 'dropdown' }, {
      default: () => [
        h(CDropdownTrigger, { 'data-testid': 'trigger' }, {
          default: () => 'Open',
        }),
        h(CDropdownMenu, { 'data-testid': 'menu' }, {
          default: () => 'Content',
        }),
      ],
    }),
  )

  const triggerControls = document
    .querySelector('[data-testid="trigger"]')
    ?.getAttribute('aria-controls')
  const menuId = document
    .querySelector('[data-testid="menu"]')
    ?.getAttribute('id')

  expect(triggerControls).toBeTruthy()
  expect(menuId).toBe(triggerControls)

  await cleanupComponent(app, root)
})
