<script setup lang="ts">
import type { DragOptions } from 'compotes'
import type { Component } from 'vue'
import { ref } from 'vue'
import { useDrag } from '../composables/drag'

const props = withDefaults(defineProps<{
  as?: string | Component
  options?: DragOptions
}>(), {
  as: 'div',
})

const el = ref<HTMLElement | null>(null)
const drag = useDrag(el, props.options)

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
