import { CCollapse, CCollapseTrigger } from '@src/components'
import { expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { cleanupComponent, mountComponent } from './helpers'

it('cCollapse wires trigger and exposes API', async () => {
  let api: any = null

  const { app, root } = await mountComponent(() =>
    h(CCollapse, {
      'ref': (el: any) => {
        api = el
      },
      'data-testid': 'collapse',
    }, {
      default: () => h(CCollapseTrigger, { 'data-testid': 'trigger' }, {
        default: () => 'Toggle',
      }),
    }),
  )

  const collapseId = document
    .querySelector('[data-testid="collapse"]')
    ?.getAttribute('id')
  const triggerControls = document
    .querySelector('[data-testid="trigger"]')
    ?.getAttribute('aria-controls')

  expect(collapseId).toBeTruthy()
  expect(triggerControls).toBe(collapseId)

  expect(api.instance).not.toBeNull()
  expect(api.isExpanded).toBe(false)

  api.show()
  await nextTick()
  expect(api.isExpanded).toBe(true)

  api.hide()
  await nextTick()
  expect(api.isExpanded).toBe(false)

  await cleanupComponent(app, root)
})
