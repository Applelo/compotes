import type { CollapseOptions } from 'compotes'
import { Collapse } from 'compotes'
import { type Ref, computed } from 'vue'
import { useParent } from './_parent'

export function useCollapse(
  el: Ref<HTMLElement | null>,
  options?: CollapseOptions,
) {
  return useParent(Collapse, el, options)
  // const collapse = useParent(Collapse, el, options)
  // return {
  //   collapse,
  //   isExpanded: computed(() => collapse.value?.isExpanded),
  // }
}
