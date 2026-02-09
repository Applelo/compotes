<script setup lang="ts">
import type { Dropdown, DropdownOptions } from 'compotes'
import type { Component } from 'vue'
import { computed, provide, ref, watch } from 'vue'
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

watch(el, (newEl, _oldEl, onCleanup) => {
  if (!newEl)
    return

  const events = [
    'c.dropdown.init',
    'c.dropdown.opened',
    'c.dropdown.closed',
    'c.dropdown.destroy',
  ] as const

  const handler = (e: Event) => {
    const eventName = (e.type.split('.').pop() ?? '') as keyof typeof emit
    emit(eventName, e as CustomEvent<Dropdown>)
  }

  events.forEach(event => newEl.addEventListener(event, handler))
  onCleanup(() => events.forEach(event => newEl.removeEventListener(event, handler)))
}, { immediate: true })

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
