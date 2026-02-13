import { focusChar, focusFirst, focusLast, focusSibling, generateId, getFocusElement } from '@src/utils/accessibility'
import { beforeAll, expect, it } from 'vitest'
import { page } from 'vitest/browser'

let bodyHTML: string = ''

beforeAll(() => {
  const html = `
  <div data-testid="container">
    <div data-testid="item-1"><button data-testid="btn-1">Alpha</button></div>
    <div data-testid="item-2"><button data-testid="btn-2">Beta</button></div>
    <div data-testid="item-3"><button data-testid="btn-3">Charlie</button></div>
  </div>
  <div data-testid="empty-container"></div>
`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return () => {
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('generateId returns incrementing IDs', () => {
  const id1 = generateId()
  const id2 = generateId()
  expect(id1).toMatch(/^c-id-\d+$/)
  expect(id2).toMatch(/^c-id-\d+$/)
  // IDs should be different and incrementing
  const num1 = Number.parseInt(id1.replace('c-id-', ''))
  const num2 = Number.parseInt(id2.replace('c-id-', ''))
  expect(num2).toBe(num1 + 1)
})

it('getFocusElement returns first tabbable', () => {
  const container = page.getByTestId('container').element() as Element
  const first = getFocusElement(container, 'first')
  expect(first).toBeTruthy()
  expect(first?.getAttribute('data-testid')).toBe('btn-1')
})

it('getFocusElement returns last tabbable', () => {
  const container = page.getByTestId('container').element() as Element
  const last = getFocusElement(container, 'last')
  expect(last).toBeTruthy()
  expect(last?.getAttribute('data-testid')).toBe('btn-3')
})

it('getFocusElement returns null for empty container', () => {
  const container = page.getByTestId('empty-container').element() as Element
  const result = getFocusElement(container, 'first')
  expect(result).toBeNull()
})

it('focusFirst focuses the first tabbable element', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const result = focusFirst(container)
  expect(result).toBe(true)
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-1')
})

it('focusFirst returns undefined when no tabbable elements', () => {
  const container = page.getByTestId('empty-container').element() as HTMLElement
  const result = focusFirst(container)
  expect(result).toBeUndefined()
})

it('focusFirst with rootEl calls scrollTo', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const rootEl = document.createElement('div')
  document.body.appendChild(rootEl)
  rootEl.scrollTop = 100
  const result = focusFirst(container, rootEl)
  expect(result).toBe(true)
  document.body.removeChild(rootEl)
})

it('focusLast focuses the last tabbable element', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const result = focusLast(container)
  expect(result).toBe(true)
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-3')
})

it('focusLast returns undefined when no tabbable elements', () => {
  const container = page.getByTestId('empty-container').element() as HTMLElement
  const result = focusLast(container)
  expect(result).toBeUndefined()
})

it('focusSibling navigates to next element', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const btn1 = page.getByTestId('btn-1').element() as HTMLElement
  btn1.focus()
  focusSibling(container, 'next')
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-2')
})

it('focusSibling navigates to previous element', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const btn2 = page.getByTestId('btn-2').element() as HTMLElement
  btn2.focus()
  focusSibling(container, 'previous')
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-1')
})

it('focusSibling wraps around at the end (next)', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const btn3 = page.getByTestId('btn-3').element() as HTMLElement
  btn3.focus()
  focusSibling(container, 'next')
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-1')
})

it('focusSibling wraps around at the start (previous)', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const btn1 = page.getByTestId('btn-1').element() as HTMLElement
  btn1.focus()
  focusSibling(container, 'previous')
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-3')
})

it('focusSibling falls back to focusFirst when no activeElement in container', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  // Blur all elements so activeElement is body or null relative to container
  ;(document.activeElement as HTMLElement)?.blur()
  // Focus something outside the container items
  document.body.focus()
  focusSibling(container, 'next')
  // Should focus the first element
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-1')
})

it('focusChar focuses element matching character', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  focusChar(container, 'b')
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-2')
})

it('focusChar focuses element matching uppercase character', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  focusChar(container, 'c')
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-3')
})

it('focusChar does nothing when no match', () => {
  const container = page.getByTestId('container').element() as HTMLElement
  const btn1 = page.getByTestId('btn-1').element() as HTMLElement
  btn1.focus()
  focusChar(container, 'z')
  // Focus should not change
  expect(document.activeElement?.getAttribute('data-testid')).toBe('btn-1')
})
