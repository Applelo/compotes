<script setup lang="ts">
import type { Dropdown, DropdownOptions } from 'compotes'
import type { Component } from 'vue'
import { computed, provide, ref } from 'vue'
import { useComponentEvents } from '../composables/_events'
import { useDropdown } from '../composables/dropdown'
import { useStableId } from '../utils/id'
import { dropdownContextKey } from './context'

const props = withDefaults(defineProps<{
  as?: string | Component
  id?: string
  options?: DropdownOptions
}>(), {
  as: 'div',
})

const emit = defineEmits<{
  init: [event: CustomEvent<Dropdown>]
  opened: [event: CustomEvent<Dropdown>]
  closed: [event: CustomEvent<Dropdown>]
  destroy: [event: CustomEvent<Dropdown>]
}>()

const el = ref<HTMLElement | null>(null)
const dropdown = useDropdown(el, props.options)

const autoId = useStableId('c-dropdown')
const menuId = computed(() => props.id ?? autoId)

provide(dropdownContextKey, { menuId })

useComponentEvents(
  el,
  'dropdown',
  ['init', 'opened', 'closed', 'destroy'],
  emit,
)

defineExpose(dropdown)
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="c-dropdown"
  >
    <slot />
  </component>
</template>
