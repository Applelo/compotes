import type { MarqueeOptions } from 'compotes'
import { Marquee } from 'compotes'
import type { Ref } from 'vue'
import { useParent } from './_parent'

export function useMarquee(
  el: Ref<HTMLElement | null>,
  options?: MarqueeOptions,
) {
  return useParent(Marquee, el, options)
}
