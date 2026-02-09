<script setup lang="ts">
import type { DrilldownOptions } from 'compotes'
import type { Component } from 'vue'
import { ref } from 'vue'
import { useDrilldown } from '../composables/drilldown'

const props = withDefaults(defineProps<{
  as?: string | Component
  options?: DrilldownOptions
}>(), {
  as: 'nav',
})

const el = ref<HTMLElement | null>(null)
const drilldown = useDrilldown(el, props.options)

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
