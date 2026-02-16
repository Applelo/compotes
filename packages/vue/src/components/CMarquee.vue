<script setup lang="ts">
import type { Marquee, MarqueeOptions } from 'compotes'
import type { Component } from 'vue'
import { ref } from 'vue'
import { useComponentEvents } from '../composables/_events'
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

useComponentEvents(
  el,
  'marquee',
  ['init', 'play', 'pause', 'loop', 'destroy'],
  emit,
)

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
