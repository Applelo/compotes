import type { Marquee, MarqueeOptions, StateChangeCallback } from 'compotes'
import type { Ref } from 'vue'
import { Marquee as MarqueeComponent } from 'compotes'
import { markRaw, shallowReactive, watch } from 'vue'
import { useParent } from './_parent'

export interface MarqueeComposableState {
  instance: Marquee | null
  isPaused: boolean
}

export interface MarqueeComposableActions {
  play: () => void
  pause: () => void
  update: (fill?: boolean) => void
  destroy: () => void
}

export type MarqueeComposable = Readonly<MarqueeComposableState> & MarqueeComposableActions

export function useMarquee(
  el: Ref<HTMLElement | null>,
  options?: MarqueeOptions,
): MarqueeComposable {
  const state = shallowReactive<MarqueeComposableState>({
    instance: null as Marquee | null,
    isPaused: false,
  })

  const opts = options || {}
  const composableOptions: MarqueeOptions = {
    ...opts,
    onStateChange: ((newState: any) => {
      state.isPaused = newState.isPaused
    }) as StateChangeCallback,
  }

  const instance = useParent(MarqueeComponent, el, composableOptions)

  watch(instance, (target) => {
    state.instance = target ? markRaw(target) : null

    if (target) {
      // Initial state sync
      state.isPaused = target.isPaused
    }
    else {
      state.isPaused = false
    }
  }, { immediate: true })

  const play = () => {
    instance.value?.play()
  }
  const pause = () => {
    instance.value?.pause()
  }
  const update = (fill?: boolean) => instance.value?.update(fill)
  const destroy = () => instance.value?.destroy()

  const actions: MarqueeComposableActions = {
    play,
    pause,
    update,
    destroy,
  }

  return Object.assign(state, actions) as MarqueeComposable
}
