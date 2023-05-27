import { tabbable } from 'tabbable'

let idIncrement = 0

export function focusFirst(container: HTMLElement) {
  const tabbables = tabbable(container, { displayCheck: 'none' })
  if (tabbables.length === 0)
    return
  const firstEl = tabbables[0]
  firstEl.focus()
}

export function focusLast(container: HTMLElement) {
  const tabbables = tabbable(container, { displayCheck: 'none' })
  if (tabbables.length === 0)
    return
  const lastEl = tabbables[tabbables.length - 1]
  lastEl.focus()
}

export function generateUniqueId() {
  idIncrement++
  return `c-id-${idIncrement}`
}
