import type { CollapseOptions } from 'compotes'
import type { Ref } from 'vue'
import { Collapse } from 'compotes'
import { useParent } from './_parent'

export function useCollapse(
  el: Ref<HTMLElement | null>,
  options?: CollapseOptions,
) {
  return useParent(Collapse, el, options)
}
