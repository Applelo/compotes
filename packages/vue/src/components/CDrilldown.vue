<script setup lang="ts">
import type { Drilldown, DrilldownOptions } from 'compotes'
import type { Component } from 'vue'
import { ref } from 'vue'
import { useComponentEvents } from '../composables/_events'
import { useDrilldown } from '../composables/drilldown'

const props = withDefaults(defineProps<{
  as?: string | Component
  options?: DrilldownOptions
}>(), {
  as: 'nav',
})

const emit = defineEmits<{
  init: [event: CustomEvent<Drilldown>]
  destroy: [event: CustomEvent<Drilldown>]
  update: [event: CustomEvent<Drilldown>]
  next: [event: CustomEvent<Drilldown>]
  back: [event: CustomEvent<Drilldown>]
  reset: [event: CustomEvent<Drilldown>]
}>()

const el = ref<HTMLElement | null>(null)
const drilldown = useDrilldown(el, props.options)

useComponentEvents(
  el,
  'drilldown',
  ['init', 'destroy', 'update', 'next', 'back', 'reset'],
  emit,
)

defineExpose(drilldown)
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="c-drilldown"
  >
    <slot />
  </component>
</template>
