import type { Collapse, CollapseOptions } from 'compotes'
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
  const instance = useParent(CollapseComponent, el, options)
  const state = shallowReactive<CollapseComposableState>({
    instance: null as Collapse | null,
    isExpanded: false,
    isCollapsing: false,
  })

  const sync = (target: Collapse | null) => {
    if (!target) {
      state.isExpanded = false
      state.isCollapsing = false
      return
    }
    state.isExpanded = target.isExpanded
    state.isCollapsing = target.isCollapsing
  }

  watch(instance, (target, _prev, onCleanup) => {
    state.instance = target ? markRaw(target) : null

    if (!target?.el) {
      sync(target)
      return
    }

    const handler = () => sync(target)
    const events = [
      'c.collapse.update',
      'c.collapse.show',
      'c.collapse.shown',
      'c.collapse.hide',
      'c.collapse.hidden',
    ] as const

    events.forEach((event) => {
      target.el?.addEventListener(event, handler as EventListener)
    })

    onCleanup(() => {
      events.forEach((event) => {
        target.el?.removeEventListener(event, handler as EventListener)
      })
    })

    sync(target)
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
