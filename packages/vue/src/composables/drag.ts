import type { Drag, DragOptions } from 'compotes'
import type { Ref } from 'vue'
import { Drag as DragComponent } from 'compotes'
import { markRaw, shallowReactive, watch } from 'vue'
import { useParent } from './_parent'

export interface DragComposableState {
  instance: Drag | null
  isDragging: boolean
  isDraggable: boolean
}

export interface DragComposableActions {
  destroy: () => void
}

export type DragComposable = Readonly<DragComposableState> & DragComposableActions

export function useDrag(
  el: Ref<HTMLElement | null>,
  options?: DragOptions,
): DragComposable {
  const instance = useParent(DragComponent, el, options)
  const state = shallowReactive<DragComposableState>({
    instance: null as Drag | null,
    isDragging: false,
    isDraggable: false,
  })

  const sync = (target: Drag | null) => {
    if (!target) {
      state.isDragging = false
      state.isDraggable = false
      return
    }
    state.isDragging = target.isDragging
    state.isDraggable = target.isDraggable
  }

  watch(instance, (target, _prev, onCleanup) => {
    state.instance = target ? markRaw(target) : null

    if (!target?.el) {
      sync(target)
      return
    }

    const onStart = () => {
      state.isDragging = true
    }
    const onEnd = () => {
      state.isDragging = false
    }

    target.el.addEventListener('c.drag.start', onStart as EventListener)
    target.el.addEventListener('c.drag.end', onEnd as EventListener)

    const resizeObserver = new ResizeObserver(() => {
      state.isDraggable = target.isDraggable
    })
    resizeObserver.observe(target.el)

    onCleanup(() => {
      target.el?.removeEventListener('c.drag.start', onStart as EventListener)
      target.el?.removeEventListener('c.drag.end', onEnd as EventListener)
      resizeObserver.disconnect()
    })

    sync(target)
  }, { immediate: true })

  const destroy = () => instance.value?.destroy()

  const actions: DragComposableActions = { destroy }

  return Object.assign(state, actions) as DragComposable
}
