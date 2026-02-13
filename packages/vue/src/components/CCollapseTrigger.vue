<script setup lang="ts">
import type { Component } from 'vue'
import { useAttrs } from 'vue'

withDefaults(defineProps<{
  ariaControls: string
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
    :aria-controls="ariaControls"
    class="c-collapse-trigger"
  >
    <slot />
  </component>
</template>
