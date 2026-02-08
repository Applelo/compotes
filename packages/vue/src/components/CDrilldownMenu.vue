<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import { useStableId } from '../utils/id'

const props = withDefaults(defineProps<{
  as?: string | Component
  id?: string
}>(), {
  as: 'ul',
})

const autoId = useStableId('c-drilldown-menu')
const resolvedId = computed(() => props.id ?? autoId)
</script>

<template>
  <component
    :is="as"
    :id="resolvedId"
    class="c-drilldown-menu"
  >
    <slot />
  </component>
</template>
