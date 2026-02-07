import type { MarqueeOptions } from 'compotes'
import type { Ref } from 'vue'
import { Marquee } from 'compotes'
import { useParent } from './_parent'

export function useMarquee(
  el: Ref<HTMLElement | null>,
  options?: MarqueeOptions,
): Ref<Marquee | null> {
  return useParent(Marquee, el, options)
}
