import { tabbable } from 'tabbable'

let idIncrement = 0

/**
 * Generate an unique ID
 */
export function generateId() {
  idIncrement++
  return `c-id-${idIncrement}`
}

/**
 * Focus on the first element
 */
export function focusFirst(container: HTMLElement) {
  const tabbables = tabbable(container, { displayCheck: 'none' })
  if (tabbables.length === 0)
    return false
  const firstEl = tabbables[0]
  firstEl.focus()
  return true
}

/**
 * Focus on the last element
 */
export function focusLast(container: HTMLElement) {
  const tabbables = tabbable(container, { displayCheck: 'none' })
  if (tabbables.length === 0)
    return false
  const lastEl = tabbables[tabbables.length - 1]
  lastEl.focus()
  return true
}

/**
 * Focus on the next or previous sibling
 */
export function focusSibling(container: HTMLElement, dir: 'next' | 'previous') {
  const activeElement = document.activeElement as HTMLElement | null
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

  return dir === 'next' ? focusFirst(container) : focusLast(container)
}

/**
 * Focus on the first char corresponding element
 */
export function focusChar(container: HTMLElement, char: string) {
  const items = Array.from(container.querySelectorAll(':scope > *'))
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const tabbables = tabbable(item, { displayCheck: 'none' })
    const focusEl = tabbables.length ? tabbables[0] : null

    if (
      focusEl
      && focusEl.textContent
      && focusEl.textContent.trim().toLowerCase()[0] === char
    ) {
      focusEl.focus()
      return
    }
  }
}
