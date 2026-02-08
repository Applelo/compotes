import type { App, VNode } from 'vue'
import { createApp, defineComponent, nextTick } from 'vue'

export interface MountedComponent {
  app: App<Element>
  root: HTMLElement
}

export async function mountComponent(render: () => VNode): Promise<MountedComponent> {
  const root = document.createElement('div')
  document.body.appendChild(root)

  const app = createApp(defineComponent({
    setup() {
      return () => render()
    },
  }))

  app.mount(root)
  await nextTick()

  return { app, root }
}

export async function cleanupComponent(app: App<Element>, root: HTMLElement): Promise<void> {
  app.unmount()
  root.remove()
  await nextTick()
}
