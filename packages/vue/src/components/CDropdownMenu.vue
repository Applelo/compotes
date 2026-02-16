<script setup lang="ts">
import type { Component } from 'vue'
import { computed, inject } from 'vue'
import { dropdownContextKey } from './context'

const props = withDefaults(defineProps<{
  as?: string | Component
  id?: string
}>(), {
  as: 'div',
})

const context = inject(dropdownContextKey, null)

const resolvedId = computed(() => props.id ?? context?.menuId.value)
</script>

<template>
  <component
    :is="as"
    :id="resolvedId"
    class="c-dropdown-container"
  >
    <slot />
  </component>
</template>
