import type { ComputedRef, InjectionKey } from 'vue'

export interface CollapseContext {
  id: ComputedRef<string>
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('CollapseContext')

export interface DropdownContext {
  menuId: ComputedRef<string>
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('DropdownContext')
