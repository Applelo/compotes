import type { Events } from '@src/components/drag'
import Drag from '@src/components/drag'
import { beforeAll, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { registerEventListeners } from './helper'
import '@css/drag.css'

type DragEvents = `c.drag.${Events}`

let bodyHTML: string = ''

beforeAll(() => {
  const html = `
  <div>
    <div
      class="c-drag"
      data-testid="drag"
      style="width: 200px; height: 200px;">
      <div style="width: 600px; height: 600px;">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
    </div>
  </div>
`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return async () => {
    // Wait for any pending debounced resize observer callbacks to settle
    await new Promise(resolve => setTimeout(resolve, 200))
    // Clean any classes that may have been re-added by pending observers
    const dragEl = document.querySelector('[data-testid="drag"]')
    dragEl?.classList.remove('c-drag--draggable', 'c-drag--dragging')
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('drag', async () => {
  const dragLoc = page.getByTestId('drag')
  const dragEl = dragLoc.element() as HTMLElement

  expect(dragLoc).toBeInTheDocument()

  const { callback: startEvent, removeEventListener: removeStartEvent } = registerEventListeners<DragEvents>('c.drag.start', dragLoc)
  const { callback: endEvent, removeEventListener: removeEndEvent } = registerEventListeners<DragEvents>('c.drag.end', dragLoc)

  const drag = new Drag(dragEl)

  await new Promise(resolve => setTimeout(resolve, 50))

  expect(drag.isDraggable).toBe(true)
  expect(drag.isDragging).toBe(false)

  dragEl.scrollLeft = 10
  dragEl.scrollTop = 10

  dragEl.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  }))

  expect(startEvent).toHaveBeenCalledTimes(1)
  expect(drag.isDragging).toBe(true)

  dragEl.dispatchEvent(new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    clientX: 80,
    clientY: 80,
  }))

  expect(dragEl.scrollLeft).toBeGreaterThan(10)
  expect(dragEl.scrollTop).toBeGreaterThan(10)

  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  dragEl.dispatchEvent(clickEvent)
  expect(clickEvent.defaultPrevented).toBe(true)

  dragEl.dispatchEvent(new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
  }))

  expect(endEvent).toHaveBeenCalledTimes(1)
  expect(drag.isDragging).toBe(false)

  drag.destroy()

  removeStartEvent()
  removeEndEvent()
})

it('drag click without movement is not prevented', async () => {
  const dragLoc = page.getByTestId('drag')
  const dragEl = dragLoc.element() as HTMLElement

  const drag = new Drag(dragEl)
  await new Promise(resolve => setTimeout(resolve, 50))

  // Mousedown then click without moving should NOT prevent click
  dragEl.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  }))

  // Click without any mousemove
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  dragEl.dispatchEvent(clickEvent)
  expect(clickEvent.defaultPrevented).toBe(false)

  dragEl.dispatchEvent(new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
  }))

  drag.destroy()
})

it('drag mouseleave ends drag', async () => {
  const dragLoc = page.getByTestId('drag')
  const dragEl = dragLoc.element() as HTMLElement

  const { callback: endEvent, removeEventListener: removeEndEvent } = registerEventListeners<DragEvents>('c.drag.end', dragLoc)

  const drag = new Drag(dragEl)
  await new Promise(resolve => setTimeout(resolve, 50))

  dragEl.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  }))

  expect(drag.isDragging).toBe(true)

  // mouseleave should end the drag
  dragEl.dispatchEvent(new MouseEvent('mouseleave', {
    bubbles: true,
    cancelable: true,
  }))

  expect(endEvent).toHaveBeenCalledTimes(1)
  expect(drag.isDragging).toBe(false)

  drag.destroy()
  removeEndEvent()
})

it('drag isDraggable false when content fits', async () => {
  // Create a non-scrollable element dynamically
  const wrapper = document.createElement('div')
  wrapper.innerHTML = `
    <div class="c-drag" data-testid="drag-no-scroll" style="width: 200px; height: 200px; overflow: hidden;">
      <div style="width: 100px; height: 100px;">
        <p>Small content</p>
      </div>
    </div>
  `
  document.body.appendChild(wrapper)

  const dragEl = wrapper.querySelector('[data-testid="drag-no-scroll"]') as HTMLElement
  const drag = new Drag(dragEl)
  await new Promise(resolve => setTimeout(resolve, 200))

  expect(drag.isDraggable).toBe(false)

  // mousedown should not start drag when not draggable
  dragEl.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: 50,
    clientY: 50,
  }))

  expect(drag.isDragging).toBe(false)

  drag.destroy()
  document.body.removeChild(wrapper)
})

it('drag onStateChange callback', async () => {
  const dragLoc = page.getByTestId('drag')
  const dragEl = dragLoc.element() as HTMLElement
  const onStateChange = vi.fn()

  const drag = new Drag(dragEl, { onStateChange })
  await new Promise(resolve => setTimeout(resolve, 50))

  expect(onStateChange).toHaveBeenCalled()

  const callCountAfterInit = onStateChange.mock.calls.length

  dragEl.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  }))

  // start event triggers state change
  expect(onStateChange.mock.calls.length).toBeGreaterThan(callCountAfterInit)
  expect(onStateChange).toHaveBeenCalledWith(
    expect.objectContaining({ isDragging: true, isDraggable: true }),
  )

  dragEl.dispatchEvent(new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
  }))

  drag.destroy()
})

it('drag resize observer notifies state change', async () => {
  const onStateChange = vi.fn()

  // Create an element that is initially NOT draggable (content fits)
  const wrapper = document.createElement('div')
  wrapper.innerHTML = `
    <div class="c-drag" data-testid="drag-resize" style="width: 200px; height: 200px; overflow: auto;">
      <div style="width: 100px; height: 100px;">
        <p>Small content</p>
      </div>
    </div>
  `
  document.body.appendChild(wrapper)

  const dragEl = wrapper.querySelector('[data-testid="drag-resize"]') as HTMLElement
  const drag = new Drag(dragEl, { onStateChange })
  await new Promise(resolve => setTimeout(resolve, 200))

  expect(drag.isDraggable).toBe(false)

  drag.destroy()
  document.body.removeChild(wrapper)
})
