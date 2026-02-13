import type { ComputedRef, InjectionKey } from 'vue'

export interface DropdownContext {
  menuId: ComputedRef<string>
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('DropdownContext')
