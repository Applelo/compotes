import { Dropdown } from 'compotes'
import type { DropdownOptions } from 'compotes'
import type { Ref } from 'vue'
import { useParent } from './_parent'

export function useDropdown(
  el: Ref<HTMLElement | null>,
  options?: DropdownOptions,
) {
  return useParent(Dropdown, el, options)
}
