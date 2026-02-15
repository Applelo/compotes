import type { Ref } from 'vue'
import { getCurrentInstance, watch } from 'vue'

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
  // Filter to only events that have a Vue listener (e.g. @init → onInit in vnode.props)
  const instance = getCurrentInstance()
  const vnodeProps = instance?.vnode.props
  const listenedEvents = vnodeProps
    ? eventNames.filter((name) => {
        const propKey = `on${name.charAt(0).toUpperCase()}${name.slice(1)}`
        return propKey in vnodeProps
      })
    : eventNames

  if (listenedEvents.length === 0)
    return

  watch(el, (newEl, _oldEl, onCleanup) => {
    if (!newEl)
      return

    const events = listenedEvents.map(name => `c.${componentName}.${name}`)

    const handler = (e: Event) => {
      const eventName = e.type.split('.').pop() ?? ''
      emit(eventName, e as CustomEvent)
    }

    events.forEach(event => newEl.addEventListener(event, handler))
    onCleanup(() => events.forEach(event => newEl.removeEventListener(event, handler)))
  }, { immediate: true })
}
