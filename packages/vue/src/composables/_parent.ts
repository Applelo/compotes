import type { Ref } from 'vue'
import { onMounted, onUnmounted, onUpdated, ref, shallowRef } from 'vue'
import type { Parent, ParentOptions } from 'compotes'

type ComposableOptions<O extends ParentOptions<any>> = O & {
  /**
   * Use shallowRef instead of ref
   */
  shallow?: boolean
}

export function useParent<
  E extends string,
  O extends ParentOptions<E>,
  T extends Parent<E>,
>(
  ComponentClass: new (el: HTMLElement | string, options?: O) => T,
  el: Ref<HTMLElement | null>,
  options: ComposableOptions<O> = {} as ComposableOptions<O>,
) {
  const component: Ref<T | null> = options.shallow ? shallowRef(null) : ref(null)

  const init = () => {
    if (!el.value)
      return
    const { shallow, ...componentOptions } = options
    component.value = new ComponentClass(el.value, componentOptions as O)
  }

  onMounted(() => init())

  onUpdated(() => {
    component.value?.destroy()
    init()
  })

  onUnmounted(() => component.value?.destroy())

  return component
}
