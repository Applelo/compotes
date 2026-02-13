<script setup lang="ts">
import type { Drag, DragOptions } from 'compotes'
import type { Component } from 'vue'
import { ref } from 'vue'
import { useComponentEvents } from '../composables/_events'
import { useDrag } from '../composables/drag'

const props = withDefaults(defineProps<{
  as?: string | Component
  options?: DragOptions
}>(), {
  as: 'div',
})

const emit = defineEmits<{
  init: [event: CustomEvent<Drag>]
  start: [event: CustomEvent<Drag>]
  end: [event: CustomEvent<Drag>]
  destroy: [event: CustomEvent<Drag>]
}>()

const el = ref<HTMLElement | null>(null)
const drag = useDrag(el, props.options)

useComponentEvents(
  el,
  'drag',
  ['init', 'start', 'end', 'destroy'],
  emit,
)

defineExpose(drag)
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="c-drag"
  >
    <slot />
  </component>
</template>
