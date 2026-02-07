import type { DrilldownOptions } from 'compotes'
import type { Ref } from 'vue'
import { Drilldown } from 'compotes'
import { useParent } from './_parent'

export function useDrilldown(
  el: Ref<HTMLElement | null>,
  options?: DrilldownOptions,
): Ref<Drilldown | null> {
  return useParent(Drilldown, el, options)
}
