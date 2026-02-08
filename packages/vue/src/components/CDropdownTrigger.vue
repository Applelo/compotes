<script setup lang="ts">
import type { Component } from 'vue'
import { inject, useAttrs } from 'vue'
import { dropdownContextKey } from './context'

withDefaults(defineProps<{
  as?: string | Component
}>(), {
  as: 'button',
})

const attrs = useAttrs()
const context = inject(dropdownContextKey, null)
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? ((attrs.type as string | undefined) ?? 'button') : undefined"
    :aria-controls="(attrs['aria-controls'] as string | undefined) ?? context?.menuId.value"
    class="c-dropdown-trigger"
  >
    <slot />
  </component>
</template>
