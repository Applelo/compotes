<script setup lang="ts">
import type { CollapseOptions } from 'compotes'
import type { Component } from 'vue'
import { computed, provide, ref } from 'vue'
import { useCollapse } from '../composables/collapse'
import { useStableId } from '../utils/id'
import { collapseContextKey } from './context'

const props = withDefaults(defineProps<{
  as?: string | Component
  id?: string
  options?: CollapseOptions
  defaultOpen?: boolean
}>(), {
  as: 'div',
  defaultOpen: false,
})

const el = ref<HTMLElement | null>(null)
const collapse = useCollapse(el, props.options)

const autoId = useStableId('c-collapse')
const collapseId = computed(() => props.id ?? autoId)

provide(collapseContextKey, { id: collapseId })

defineExpose(collapse)
</script>

<template>
  <component
    :is="as"
    :id="collapseId"
    ref="el"
    class="c-collapse"
    :class="{ 'c-collapse--show': defaultOpen }"
  >
    <slot />
  </component>
</template>
