import type { Parent, ParentOptions } from 'compotes'
import type { Ref, ShallowRef } from 'vue'
import { onMounted, onUnmounted, onUpdated, shallowRef } from 'vue'

export function useParent<T extends Parent>(
  ComponentClass: new (el: HTMLElement, options: ParentOptions<'init' | 'destroy'>) => T,
  el: Ref<HTMLElement | null>,
  options: ParentOptions<'init' | 'destroy'> = {},
) {
  const component: ShallowRef<T | null> = shallowRef(null)

  const init = () => {
    if (!el.value)
      return
    component.value = new ComponentClass(el.value, options)
  }

  onMounted(() => init())

  onUpdated(() => {
    component.value?.destroy()
    init()
  })

  onUnmounted(() => component.value?.destroy())

  return component
}
