import type { Dropdown, DropdownOptions } from 'compotes'
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
  const instance = useParent(DropdownComponent, el, options)
  const state = shallowReactive<DropdownComposableState>({
    instance: null as Dropdown | null,
    isOpen: false,
    type: 'default' as 'default' | 'menu',
  })

  const sync = (target: Dropdown | null) => {
    if (!target) {
      state.isOpen = false
      state.type = 'default'
      return
    }
    state.isOpen = target.isOpen
    state.type = target.type
  }

  watch(instance, (target, _prev, onCleanup) => {
    state.instance = target ? markRaw(target) : null

    if (!target?.el) {
      sync(target)
      return
    }

    const onOpen = () => {
      state.isOpen = true
      state.type = target.type
    }
    const onClose = () => {
      state.isOpen = false
      state.type = target.type
    }

    target.el.addEventListener('c.dropdown.opened', onOpen as EventListener)
    target.el.addEventListener('c.dropdown.closed', onClose as EventListener)

    onCleanup(() => {
      target.el?.removeEventListener('c.dropdown.opened', onOpen as EventListener)
      target.el?.removeEventListener('c.dropdown.closed', onClose as EventListener)
    })

    sync(target)
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
