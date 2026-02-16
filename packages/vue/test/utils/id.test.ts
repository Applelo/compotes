import { useStableId } from '@src/utils/id'
import { expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { cleanupComponent, mountComponent } from '../components/helpers'

it('useStableId inside a Vue component returns prefixed id', async () => {
  let stableId = ''

  const { app, root } = await mountComponent(() =>
    h(defineComponent({
      setup() {
        stableId = useStableId('c-test')
        return () => h('div', { 'data-testid': 'id-test' }, stableId)
      },
    })),
  )

  expect(stableId).toBeTruthy()
  expect(stableId).toMatch(/^c-test-/)

  await cleanupComponent(app, root)
})

it('useStableId outside Vue component still returns prefixed id', () => {
  // Calling outside a setup() context — useId or fallback path
  const id1 = useStableId('c-fallback')

  expect(id1).toMatch(/^c-fallback-/)
  expect(typeof id1).toBe('string')
})

it('useStableId with different prefixes produces correct format', async () => {
  let id1 = ''
  let id2 = ''

  const { app, root } = await mountComponent(() =>
    h(defineComponent({
      setup() {
        id1 = useStableId('c-dropdown')
        id2 = useStableId('c-collapse')
        return () => h('div')
      },
    })),
  )

  expect(id1).toMatch(/^c-dropdown-/)
  expect(id2).toMatch(/^c-collapse-/)

  await cleanupComponent(app, root)
})
