import type { FocusableElement } from 'tabbable'
import { tabbable } from 'tabbable'

let idIncrement = 0

/**
 * Generate an unique ID
 */
export function generateId(): string {
  idIncrement++
  return `c-id-${idIncrement}`
}

/**
 * Get first or last focusable element inside an element
 */
export function getFocusElement(
  container: Element,
  position: 'first' | 'last',
): FocusableElement | null {
  const tabbables = tabbable(container, { displayCheck: 'none' })
  if (tabbables.length === 0)
    return null
  return position === 'first' ? tabbables[0] : tabbables[tabbables.length - 1]
}

/**
 * Focus on the first element
 */
export function focusFirst(
  container: HTMLElement,
  rootEl?: HTMLElement,
): boolean | undefined {
  const firstEl = getFocusElement(container, 'first')
  if (!firstEl)
    return
  firstEl.focus()
  if (rootEl)
    rootEl.scrollTo(0, 0)
  return true
}

/**
 * Focus on the last element
 */
export function focusLast(container: HTMLElement): boolean | undefined {
  const lastEl = getFocusElement(container, 'last')
  if (!lastEl)
    return
  lastEl.focus()
  return true
}

/**
 * Focus on the next or previous sibling
 */
export function focusSibling(
  container: HTMLElement,
  dir: 'next' | 'previous',
): boolean | undefined {
  const activeElement = document.activeElement as HTMLElement | null
  /* istanbul ignore if -- @preserve */
  if (!activeElement || !container)
    return focusFirst(container)

  const currentItem = activeElement.parentElement
  const items = Array.from(container.querySelectorAll(':scope > *')) as HTMLElement[]
  const currentItemIndex = items.findIndex(item => currentItem === item)
  if (currentItemIndex === -1)
    return focusFirst(container)

  if (dir === 'next' && currentItemIndex === items.length - 1)
    return focusFirst(container)

  else if (dir === 'previous' && currentItemIndex === 0)
    return focusLast(container)

  for (
    let index = dir === 'next' ? currentItemIndex + 1 : currentItemIndex - 1;
    dir === 'next' ? index < items.length : index >= 0;
    dir === 'next' ? index++ : index--
  ) {
    const item = items[index]
    const focus = focusFirst(item)
    if (focus)
      return
  }

  /* istanbul ignore next -- @preserve */
  return dir === 'next' ? focusFirst(container) : focusLast(container)
}

/**
 * Focus on the first char corresponding element
 */
export function focusChar(container: HTMLElement, char: string): void {
  const items = Array.from(container.querySelectorAll(':scope > *'))
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const focusEl = getFocusElement(item, 'first')

    if (
      focusEl
      && focusEl.textContent
      && focusEl.textContent.trim().toLowerCase()[0] === char.toLowerCase()
    ) {
      focusEl.focus()
      return
    }
  }
}
