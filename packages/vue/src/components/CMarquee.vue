<script setup lang="ts">
import type { Marquee, MarqueeOptions } from 'compotes'
import type { Component } from 'vue'
import { ref, watch } from 'vue'
import { useMarquee } from '../composables/marquee'

const props = withDefaults(defineProps<{
  as?: string | Component
  containerAs?: string | Component
  options?: MarqueeOptions
}>(), {
  as: 'div',
  containerAs: 'ul',
})

const emit = defineEmits<{
  init: [event: CustomEvent<Marquee>]
  play: [event: CustomEvent<Marquee>]
  pause: [event: CustomEvent<Marquee>]
  loop: [event: CustomEvent<Marquee>]
  destroy: [event: CustomEvent<Marquee>]
}>()

const el = ref<HTMLElement | null>(null)
const marquee = useMarquee(el, props.options)

watch(el, (newEl, _oldEl, onCleanup) => {
  if (!newEl)
    return

  const events = [
    'c.marquee.init',
    'c.marquee.play',
    'c.marquee.pause',
    'c.marquee.loop',
    'c.marquee.destroy',
  ] as const

  const handler = (e: Event) => {
    const eventName = (e.type.split('.').pop() ?? '') as keyof typeof emit
    emit(eventName, e as CustomEvent<Marquee>)
  }

  events.forEach(event => newEl.addEventListener(event, handler))
  onCleanup(() => events.forEach(event => newEl.removeEventListener(event, handler)))
}, { immediate: true })

defineExpose(marquee)
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="c-marquee"
  >
    <component :is="containerAs" class="c-marquee-container">
      <slot />
    </component>
  </component>
</template>
