import type { Marquee, MarqueeOptions } from 'compotes'
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
  const instance = useParent(MarqueeComponent, el, options)
  const state = shallowReactive<MarqueeComposableState>({
    instance: null as Marquee | null,
    isPaused: false,
  })

  const sync = (target: Marquee | null) => {
    if (!target?.el) {
      state.isPaused = false
      return
    }
    const el = target.el
    state.isPaused = el.classList.contains('c-marquee--pause')
      || el.classList.contains('c-collapse--pause')
  }

  watch(instance, (target, _prev, onCleanup) => {
    state.instance = target ? markRaw(target) : null

    if (!target?.el) {
      sync(target)
      return
    }

    const onPlay = () => {
      state.isPaused = false
    }
    const onPause = () => {
      state.isPaused = true
    }

    target.el.addEventListener('c.marquee.play', onPlay as EventListener)
    target.el.addEventListener('c.marquee.pause', onPause as EventListener)

    onCleanup(() => {
      target.el?.removeEventListener('c.marquee.play', onPlay as EventListener)
      target.el?.removeEventListener('c.marquee.pause', onPause as EventListener)
    })

    sync(target)
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
