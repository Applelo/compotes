<script setup lang="ts">
import type { MarqueeOptions } from 'compotes'
import type { Component } from 'vue'
import { ref } from 'vue'
import { useMarquee } from '../composables/marquee'
import 'compotes/css/marquee'

const props = withDefaults(defineProps<{
  as?: string | Component
  containerAs?: string | Component
  options?: MarqueeOptions
}>(), {
  as: 'div',
  containerAs: 'ul',
})

const el = ref<HTMLElement | null>(null)
const marquee = useMarquee(el, props.options)

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
