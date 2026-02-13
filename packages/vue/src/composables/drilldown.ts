import type { Drilldown, DrilldownOptions, DrilldownState, StateChangeCallback } from 'compotes'
import type { Ref } from 'vue'
import { Drilldown as DrilldownComponent } from 'compotes'
import { markRaw, shallowReactive, watch } from 'vue'
import { useParent } from './_parent'

export interface DrilldownComposableState {
  instance: Drilldown | null
  level: number
  currentMenuId: string | null
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
  const state = shallowReactive<DrilldownComposableState>({
    instance: null as Drilldown | null,
    level: 0,
    currentMenuId: null,
  })

  const opts = options || {}
  const composableOptions: DrilldownOptions = {
    ...opts,
    onStateChange: ((newState: any) => {
      state.level = newState.level
      state.currentMenuId = newState.currentMenuId
    }) as StateChangeCallback,
  }

  const instance = useParent(DrilldownComponent, el, composableOptions)

  watch(instance, (target) => {
    state.instance = target ? markRaw(target) : null

    if (target) {
      // Initial state sync - access private level property via getState
      const currentState = (target as any).getState?.() as DrilldownState | undefined
      if (currentState) {
        state.level = currentState.level
        state.currentMenuId = currentState.currentMenuId
      }
    }
    else {
      state.level = 0
      state.currentMenuId = null
    }
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
