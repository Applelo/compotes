import type { Events } from '@src/components/drag'
import Drag from '@src/components/drag'
import { beforeAll, expect, it } from 'vitest'
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

  return () => {
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
