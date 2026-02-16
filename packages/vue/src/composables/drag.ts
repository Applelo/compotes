import type { Drag, DragOptions, StateChangeCallback } from 'compotes'
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
  const state = shallowReactive<DragComposableState>({
    instance: null as Drag | null,
    isDragging: false,
    isDraggable: false,
  })

  // Use state callback for draggable changes (from ResizeObserver in core)
  // but keep event listeners for drag start/end (test compatibility)
  const opts = options || {}
  const composableOptions: DragOptions = {
    ...opts,
    onStateChange: ((newState: any) => {
      state.isDraggable = newState.isDraggable
    }) as StateChangeCallback,
  }

  const instance = useParent(DragComponent, el, composableOptions)

  watch(instance, (target, _prev, onCleanup) => {
    state.instance = target ? markRaw(target) : null

    if (!target?.el) {
      state.isDragging = false
      state.isDraggable = false
      return
    }

    // Initial state sync
    state.isDragging = target.isDragging
    state.isDraggable = target.isDraggable

    // Keep event listeners for drag events (test compatibility)
    const onStart = () => {
      state.isDragging = true
    }
    const onEnd = () => {
      state.isDragging = false
    }

    target.el.addEventListener('c.drag.start', onStart as EventListener)
    target.el.addEventListener('c.drag.end', onEnd as EventListener)

    onCleanup(() => {
      target.el?.removeEventListener('c.drag.start', onStart as EventListener)
      target.el?.removeEventListener('c.drag.end', onEnd as EventListener)
    })
  }, { immediate: true })

  const destroy = () => instance.value?.destroy()

  const actions: DragComposableActions = { destroy }

  return Object.assign(state, actions) as DragComposable
}
