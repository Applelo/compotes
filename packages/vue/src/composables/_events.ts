import type { Ref } from 'vue'
import { watch } from 'vue'

/**
 * Utility composable to forward custom DOM events to Vue emits
 * Eliminates boilerplate event handling code in components
 *
 * @param el - Element reference to attach listeners to
 * @param componentName - Component name for event prefix (e.g., 'collapse', 'drag')
 * @param eventNames - Array of event names to forward (e.g., ['init', 'show', 'hide'])
 * @param emit - Vue emit function from defineEmits
 */
export function useComponentEvents(
  el: Ref<HTMLElement | null>,
  componentName: string,
  eventNames: readonly string[],
  emit: (...args: any[]) => void,
): void {
  watch(el, (newEl, _oldEl, onCleanup) => {
    if (!newEl)
      return

    const events = eventNames.map(name => `c.${componentName}.${name}`)

    const handler = (e: Event) => {
      const eventName = e.type.split('.').pop() ?? ''
      emit(eventName, e as CustomEvent)
    }

    events.forEach(event => newEl.addEventListener(event, handler))
    onCleanup(() => events.forEach(event => newEl.removeEventListener(event, handler)))
  }, { immediate: true })
}
