import type { Ref } from 'vue'
import { useParent } from '@src/composables/_parent'
import { Collapse } from 'compotes'
import { expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'

it('useParent mounts, updates, and unmounts', async () => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  const tick = ref(0)
  const elRef = ref<HTMLElement | null>(null)
  let instanceRef: Ref<Collapse | null> = ref(null)

  const App = defineComponent({
    setup() {
      instanceRef = useParent(Collapse, elRef)

      return () => h('div', [
        h('div', {
          'ref': elRef,
          'id': 'collapse',
          'class': 'c-collapse',
          'data-testid': 'parent',
        }),
        h('span', String(tick.value)),
      ])
    },
  })

  const app = createApp(App)
  app.mount(root)
  await nextTick()

  const locator = page.getByTestId('parent')
  expect(locator).toBeInTheDocument()
  expect(instanceRef.value).not.toBeNull()

  const first = instanceRef.value!
  const firstDestroy = vi.spyOn(first, 'destroy')

  tick.value += 1
  await nextTick()

  expect(firstDestroy).toHaveBeenCalledTimes(1)
  expect(instanceRef.value).not.toBe(first)

  const second = instanceRef.value!
  const secondDestroy = vi.spyOn(second, 'destroy')

  app.unmount()
  await nextTick()

  expect(secondDestroy).toHaveBeenCalledTimes(1)

  root.remove()
})
