import { CCollapse, CCollapseTrigger, CDropdown, CDropdownMenu, CDropdownTrigger } from '@src/components'
import { expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { cleanupComponent, mountComponent } from '../components/helpers'

it('useComponentEvents forwards dropdown events to Vue listeners', async () => {
  const onOpened = vi.fn()
  const onClosed = vi.fn()

  let api: any = null
  const { app, root } = await mountComponent(() =>
    h(CDropdown, {
      'data-testid': 'dropdown',
      'ref': (el: any) => { api = el },
      'onOpened': onOpened,
      'onClosed': onClosed,
    }, {
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

  // Open dropdown
  api.open()
  await nextTick()
  expect(onOpened).toHaveBeenCalled()

  // Close dropdown
  api.close()
  await nextTick()
  expect(onClosed).toHaveBeenCalled()

  await cleanupComponent(app, root)
})

it('useComponentEvents forwards collapse events to Vue listeners', async () => {
  const onShow = vi.fn()
  const onHide = vi.fn()

  let api: any = null
  const testId = 'events-collapse'

  const { app, root } = await mountComponent(() =>
    h('div', [
      h(CCollapse, {
        'id': testId,
        'ref': (el: any) => { api = el },
        'data-testid': 'collapse',
        'onShow': onShow,
        'onHide': onHide,
      }, {
        default: () => 'Collapsible content',
      }),
      h(CCollapseTrigger, {
        'ariaControls': testId,
        'data-testid': 'trigger',
      }, {
        default: () => 'Toggle',
      }),
    ]),
  )

  // Show
  api.show()
  await nextTick()
  expect(onShow).toHaveBeenCalled()

  // Wait for transition
  await new Promise(resolve => setTimeout(resolve, 300))

  // Hide
  api.hide()
  await nextTick()
  expect(onHide).toHaveBeenCalled()

  await new Promise(resolve => setTimeout(resolve, 300))

  await cleanupComponent(app, root)
})

it('useComponentEvents with no listeners does not error', async () => {
  // Mount CDropdown without any event listeners — covers listenedEvents.length === 0 early return
  const { app, root } = await mountComponent(() =>
    h(CDropdown, { 'data-testid': 'dropdown-nolisteners' }, {
      default: () => [
        h(CDropdownTrigger, null, {
          default: () => 'Open',
        }),
        h(CDropdownMenu, null, {
          default: () => 'Content',
        }),
      ],
    }),
  )

  // Should work without error
  const el = document.querySelector('[data-testid="dropdown-nolisteners"]')
  expect(el).toBeTruthy()

  await cleanupComponent(app, root)
})
