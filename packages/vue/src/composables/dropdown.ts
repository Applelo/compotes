import type { DropdownOptions } from 'compotes'
import type { Ref } from 'vue'
import { Dropdown } from 'compotes'
import { useParent } from './_parent'

export function useDropdown(
  el: Ref<HTMLElement | null>,
  options?: DropdownOptions,
): Ref<Dropdown | null> {
  return useParent(Dropdown, el, options)
}
