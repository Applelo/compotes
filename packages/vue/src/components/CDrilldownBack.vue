<script setup lang="ts">
import type { Component } from 'vue'
import { useAttrs } from 'vue'

withDefaults(defineProps<{
  as?: string | Component
}>(), {
  as: 'button',
})

const attrs = useAttrs()
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? ((attrs.type as string | undefined) ?? 'button') : undefined"
    class="c-drilldown-back"
  >
    <slot />
  </component>
</template>
