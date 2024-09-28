import { Drilldown } from 'compotes'
import type { DrilldownOptions } from 'compotes'
import type { Ref } from 'vue'
import { useParent } from './_parent'

export function useDrilldown(
  el: Ref<HTMLElement | null>,
  options?: DrilldownOptions,
) {
  return useParent(Drilldown, el, options)
}
