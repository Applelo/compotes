import { onMounted, onUnmounted, onUpdated, ref, shallowRef } from 'vue'
import type { Parent, ParentOptions } from 'compotes'
import type { Ref } from 'vue'

interface ComposableOptions extends ParentOptions<string> {
  /**
   * Use shallowRef instead of ref
   */
  shallow?: boolean
}

export function useParent<T extends Parent>(
  ComponentClass: new (el: HTMLElement, options: ParentOptions<string>) => T,
  el: Ref<HTMLElement | null>,
  options: ComposableOptions = {},
) {
  const component: Ref<T | null> = options.shallow ? shallowRef(null) : ref(null)

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
