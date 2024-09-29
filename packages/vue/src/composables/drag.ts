import type { DragOptions } from 'compotes'
import type { Ref } from 'vue'
import { Drag } from 'compotes'
import { useParent } from './_parent'

export function useDrag(
  el: Ref<HTMLElement | null>,
  options?: DragOptions,
) {
  return useParent(Drag, el, options)
}
