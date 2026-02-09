<script setup lang="ts">
import type { Drag, DragOptions } from 'compotes'
import type { Component } from 'vue'
import { ref, watch } from 'vue'
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

watch(el, (newEl, _oldEl, onCleanup) => {
  if (!newEl)
    return

  const events = [
    'c.drag.init',
    'c.drag.start',
    'c.drag.end',
    'c.drag.destroy',
  ] as const

  const handler = (e: Event) => {
    const eventName = (e.type.split('.').pop() ?? '') as keyof typeof emit
    emit(eventName, e as CustomEvent<Drag>)
  }

  events.forEach(event => newEl.addEventListener(event, handler))
  onCleanup(() => events.forEach(event => newEl.removeEventListener(event, handler)))
}, { immediate: true })

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
