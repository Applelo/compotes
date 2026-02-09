<script setup lang="ts">
import type { Drilldown, DrilldownOptions } from 'compotes'
import type { Component } from 'vue'
import { ref, watch } from 'vue'
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

watch(el, (newEl, _oldEl, onCleanup) => {
  if (!newEl)
    return

  const events = [
    'c.drilldown.init',
    'c.drilldown.destroy',
    'c.drilldown.update',
    'c.drilldown.next',
    'c.drilldown.back',
    'c.drilldown.reset',
  ] as const

  const handler = (e: Event) => {
    const eventName = (e.type.split('.').pop() ?? '') as keyof typeof emit
    emit(eventName, e as CustomEvent<Drilldown>)
  }

  events.forEach(event => newEl.addEventListener(event, handler))
  onCleanup(() => events.forEach(event => newEl.removeEventListener(event, handler)))
}, { immediate: true })

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
