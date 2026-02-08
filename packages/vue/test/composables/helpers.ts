import type { App, h, Ref } from 'vue'
import { createApp, defineComponent, nextTick, ref } from 'vue'

export interface MountedComposable<T> {
  app: App<Element>
  root: HTMLElement
  el: Ref<HTMLElement | null>
  composable: T
}

export async function mountComposable<T>(
  render: (el: Ref<HTMLElement | null>) => ReturnType<typeof h>,
  setup: (el: Ref<HTMLElement | null>) => T,
): Promise<MountedComposable<T>> {
  const root = document.createElement('div')
  document.body.appendChild(root)

  const el = ref<HTMLElement | null>(null)
  let composable!: T

  const app = createApp(defineComponent({
    setup() {
      composable = setup(el)
      return () => render(el)
    },
  }))

  app.mount(root)
  await nextTick()

  return { app, root, el, composable }
}

export async function cleanupComposable(app: App<Element>, root: HTMLElement): Promise<void> {
  app.unmount()
  root.remove()
  await nextTick()
}
