import type { Drilldown, DrilldownOptions } from 'compotes'
import type { Ref } from 'vue'
import { Drilldown as DrilldownComponent } from 'compotes'
import { markRaw, shallowReactive, watch } from 'vue'
import { useParent } from './_parent'

export interface DrilldownComposableState {
  instance: Drilldown | null
}

export interface DrilldownComposableActions {
  update: (reloadItems?: boolean) => void
  back: () => void
  reset: () => void
  destroy: () => void
}

export type DrilldownComposable = Readonly<DrilldownComposableState> & DrilldownComposableActions

export function useDrilldown(
  el: Ref<HTMLElement | null>,
  options?: DrilldownOptions,
): DrilldownComposable {
  const instance = useParent(DrilldownComponent, el, options)
  const state = shallowReactive<DrilldownComposableState>({
    instance: null as Drilldown | null,
  })

  watch(instance, (target) => {
    state.instance = target ? markRaw(target) : null
  }, { immediate: true })

  const update = (reloadItems?: boolean) => instance.value?.update(reloadItems)
  const back = () => instance.value?.back()
  const reset = () => instance.value?.reset()
  const destroy = () => instance.value?.destroy()

  const actions: DrilldownComposableActions = {
    update,
    back,
    reset,
    destroy,
  }

  return Object.assign(state, actions) as DrilldownComposable
}
