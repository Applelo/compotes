import type { Collapse, CollapseOptions, StateChangeCallback } from 'compotes'
import type { Ref } from 'vue'
import { Collapse as CollapseComponent } from 'compotes'
import { markRaw, shallowReactive, watch } from 'vue'
import { useParent } from './_parent'

export interface CollapseComposableState {
  instance: Collapse | null
  isExpanded: boolean
  isCollapsing: boolean
}

export interface CollapseComposableActions {
  show: () => void
  hide: () => void
  toggle: () => void
  update: () => void
  destroy: () => void
}

export type CollapseComposable = Readonly<CollapseComposableState> & CollapseComposableActions

export function useCollapse(
  el: Ref<HTMLElement | null>,
  options?: CollapseOptions,
): CollapseComposable {
  const state = shallowReactive<CollapseComposableState>({
    instance: null as Collapse | null,
    isExpanded: false,
    isCollapsing: false,
  })

  // Create options with state change callback
  const opts = options || {}
  const composableOptions: CollapseOptions = {
    ...opts,
    onStateChange: ((newState: any) => {
      state.isExpanded = newState.isExpanded
      state.isCollapsing = newState.isCollapsing
    }) as StateChangeCallback,
  }

  const instance = useParent(CollapseComponent, el, composableOptions)

  watch(instance, (target) => {
    state.instance = target ? markRaw(target) : null

    if (target) {
      // Initial state sync
      state.isExpanded = target.isExpanded
      state.isCollapsing = target.isCollapsing
    }
    else {
      state.isExpanded = false
      state.isCollapsing = false
    }
  }, { immediate: true })

  const show = () => instance.value?.show()
  const hide = () => instance.value?.hide()
  const toggle = () => instance.value?.toggle()
  const update = () => instance.value?.update()
  const destroy = () => instance.value?.destroy()

  const actions: CollapseComposableActions = {
    show,
    hide,
    toggle,
    update,
    destroy,
  }

  return Object.assign(state, actions) as CollapseComposable
}
