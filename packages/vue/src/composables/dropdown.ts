import type { Dropdown, DropdownOptions, StateChangeCallback } from 'compotes'
import type { Ref } from 'vue'
import { Dropdown as DropdownComponent } from 'compotes'
import { markRaw, shallowReactive, watch } from 'vue'
import { useParent } from './_parent'

export interface DropdownComposableState {
  instance: Dropdown | null
  isOpen: boolean
  type: 'default' | 'menu'
}

export interface DropdownComposableActions {
  open: () => void
  close: () => void
  toggle: () => void
  update: () => void
  equalizeWidth: () => void
  destroy: () => void
}

export type DropdownComposable = Readonly<DropdownComposableState> & DropdownComposableActions

export function useDropdown(
  el: Ref<HTMLElement | null>,
  options?: DropdownOptions,
): DropdownComposable {
  const state = shallowReactive<DropdownComposableState>({
    instance: null as Dropdown | null,
    isOpen: false,
    type: 'default' as 'default' | 'menu',
  })

  const opts = options || {}
  const composableOptions: DropdownOptions = {
    ...opts,
    onStateChange: ((newState: any) => {
      state.isOpen = newState.isOpen
      state.type = newState.type
    }) as StateChangeCallback,
  }

  const instance = useParent(DropdownComponent, el, composableOptions)

  watch(instance, (target) => {
    state.instance = target ? markRaw(target) : null

    if (target) {
      // Initial state sync
      state.isOpen = target.isOpen
      state.type = target.type
    }
    else {
      state.isOpen = false
      state.type = 'default'
    }
  }, { immediate: true })

  const open = () => {
    instance.value?.open()
  }
  const close = () => {
    instance.value?.close()
  }
  const toggle = () => {
    instance.value?.toggle()
  }
  const update = () => {
    instance.value?.update()
  }
  const equalizeWidth = () => instance.value?.equalizeWidth()
  const destroy = () => instance.value?.destroy()

  const actions: DropdownComposableActions = {
    open,
    close,
    toggle,
    update,
    equalizeWidth,
    destroy,
  }

  return Object.assign(state, actions) as DropdownComposable
}
