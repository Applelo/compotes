import { debounceMutationObserver, debounceResizeObserver } from '@src/utils/debounce'
import { beforeAll, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

let bodyHTML: string = ''

beforeAll(() => {
  const html = `<div data-testid="target" style="width: 100px; height: 100px;"></div>`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return () => {
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('debounceResizeObserver fires callback after delay', async () => {
  const callback = vi.fn()
  const observer = debounceResizeObserver(callback, 50)
  const target = page.getByTestId('target').element() as HTMLElement

  observer.observe(target)
  // Trigger resize by changing size
  target.style.width = '200px'

  await new Promise(resolve => setTimeout(resolve, 200))
  expect(callback).toHaveBeenCalled()

  target.style.width = '100px'
  observer.disconnect()
})

it('debounceResizeObserver debounces rapid triggers', async () => {
  const callback = vi.fn()
  const observer = debounceResizeObserver(callback, 100)
  const target = page.getByTestId('target').element() as HTMLElement

  observer.observe(target)

  // Rapidly change size
  target.style.width = '150px'
  await new Promise(resolve => setTimeout(resolve, 30))
  target.style.width = '180px'
  await new Promise(resolve => setTimeout(resolve, 30))
  target.style.width = '200px'

  await new Promise(resolve => setTimeout(resolve, 250))
  // Should have been debounced — callback should fire fewer times than changes
  expect(callback.mock.calls.length).toBeLessThanOrEqual(2)

  target.style.width = '100px'
  observer.disconnect()
})

it('debounceMutationObserver fires callback after delay', async () => {
  const callback = vi.fn()
  const observer = debounceMutationObserver(callback, 50)
  const target = page.getByTestId('target').element() as HTMLElement

  observer.observe(target, { childList: true })

  const child = document.createElement('span')
  target.appendChild(child)

  await new Promise(resolve => setTimeout(resolve, 200))
  expect(callback).toHaveBeenCalled()

  target.removeChild(child)
  observer.disconnect()
})

it('debounceMutationObserver debounces rapid mutations', async () => {
  const callback = vi.fn()
  const observer = debounceMutationObserver(callback, 100)
  const target = page.getByTestId('target').element() as HTMLElement

  observer.observe(target, { childList: true })

  // Rapidly add elements
  const child1 = document.createElement('span')
  target.appendChild(child1)
  await new Promise(resolve => setTimeout(resolve, 20))
  const child2 = document.createElement('span')
  target.appendChild(child2)
  await new Promise(resolve => setTimeout(resolve, 20))
  const child3 = document.createElement('span')
  target.appendChild(child3)

  await new Promise(resolve => setTimeout(resolve, 250))
  expect(callback.mock.calls.length).toBeLessThanOrEqual(2)

  target.removeChild(child1)
  target.removeChild(child2)
  target.removeChild(child3)
  observer.disconnect()
})

it('debounceResizeObserver accepts custom delay', async () => {
  const callback = vi.fn()
  const observer = debounceResizeObserver(callback, 200)
  const target = page.getByTestId('target').element() as HTMLElement

  observer.observe(target)
  target.style.width = '250px'

  // After 100ms, should not have fired yet
  await new Promise(resolve => setTimeout(resolve, 100))
  expect(callback).not.toHaveBeenCalled()

  // After total 350ms, should have fired
  await new Promise(resolve => setTimeout(resolve, 250))
  expect(callback).toHaveBeenCalled()

  target.style.width = '100px'
  observer.disconnect()
})
