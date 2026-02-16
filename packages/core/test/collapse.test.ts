import type { Events } from '@src/components/collapse'
import Collapse from '@src/components/collapse'
import { beforeAll, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { registerEventListeners } from './helper'
import '@css/collapse.css'

type CollapseEvents = `c.collapse.${Events}`

let bodyHTML: string = ''

beforeAll(() => {
  const html = `
  <div>
    <button class="c-collapse-trigger" aria-controls="accordion-1" data-testid="trigger">
      Accordion 2
    </button>
    <a class="c-collapse-trigger" aria-controls="accordion-1" data-testid="trigger-link">
      Accordion Link Trigger
    </a>
    <div
    class="c-collapse"
    id="accordion-1"
    data-testid="collapse"
    style="transition: height 0.2s;">
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
      </p>
    </div>
    <div
    class="c-collapse"
    id="accordion-notransition"
    data-testid="collapse-notransition">
      <p>No transition content</p>
    </div>
    <button class="c-collapse-trigger" aria-controls="accordion-notransition" data-testid="trigger-notransition">
      No Transition Trigger
    </button>
  </div>
`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return () => {
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('collapse', async () => {
  const triggerLoc = page.getByTestId('trigger')
  const collapseLoc = page.getByTestId('collapse')

  const { callback: showEvent, removeEventListener: removeShowEvent } = registerEventListeners<CollapseEvents>('c.collapse.show', collapseLoc)
  const { callback: hideEvent, removeEventListener: removeHideEvent } = registerEventListeners<CollapseEvents>('c.collapse.hide', collapseLoc)
  const { callback: shownEvent, removeEventListener: removeShownEvent } = registerEventListeners<CollapseEvents>('c.collapse.shown', collapseLoc)
  const { callback: hiddenEvent, removeEventListener: removeHiddenEvent } = registerEventListeners<CollapseEvents>('c.collapse.hidden', collapseLoc)

  expect(triggerLoc).toBeInTheDocument()
  expect(collapseLoc).not.toBeVisible()

  const collapse = new Collapse(collapseLoc.element() as HTMLElement)
  expect(collapse.isExpanded).toBe(false)

  await userEvent.click(triggerLoc)
  expect(triggerLoc).toHaveAttribute('aria-expanded', 'true')
  expect(showEvent).toHaveBeenCalledTimes(1)
  expect(collapse.isCollapsing).toBe(true)
  await new Promise<void>(resolve => setTimeout(resolve, 200))
  expect(collapseLoc).toBeVisible()
  expect(shownEvent).toHaveBeenCalledTimes(1)
  expect(collapse.isExpanded).toBe(true)
  expect(collapse.isCollapsing).toBe(false)

  await userEvent.click(triggerLoc)
  expect(triggerLoc).toHaveAttribute('aria-expanded', 'false')
  expect(hideEvent).toHaveBeenCalledTimes(1)
  expect(collapse.isCollapsing).toBe(true)
  await new Promise<void>(resolve => setTimeout(resolve, 200))
  expect(collapseLoc).not.toBeVisible()
  expect(hiddenEvent).toHaveBeenCalledTimes(1)
  expect(collapse.isExpanded).toBe(false)
  expect(collapse.isCollapsing).toBe(false)

  // Test JS method
  collapse.show()
  await new Promise<void>(resolve => setTimeout(resolve, 200))
  expect(collapse.isExpanded).toBe(true)

  collapse.hide()
  await new Promise<void>(resolve => setTimeout(resolve, 200))
  expect(collapse.isExpanded).toBe(false)

  // Remove event listeners
  removeShowEvent()
  removeHideEvent()
  removeShownEvent()
  removeHiddenEvent()

  collapse?.destroy()
})

it('collapse non-button trigger gets role button', () => {
  const collapseLoc = page.getByTestId('collapse')
  const triggerLinkLoc = page.getByTestId('trigger-link')

  const collapse = new Collapse(collapseLoc.element() as HTMLElement)

  // Non-button trigger should get role="button"
  expect(triggerLinkLoc.element()).toHaveAttribute('role', 'button')

  collapse.destroy()

  // After destroy, role should be cleaned up
  expect(triggerLinkLoc.element()).not.toHaveAttribute('role')
})

it('collapse show/hide without CSS transition', () => {
  const collapseLoc = page.getByTestId('collapse-notransition')

  const { callback: showEvent, removeEventListener: removeShowEvent } = registerEventListeners<CollapseEvents>('c.collapse.show', collapseLoc)
  const { callback: shownEvent, removeEventListener: removeShownEvent } = registerEventListeners<CollapseEvents>('c.collapse.shown', collapseLoc)
  const { callback: hideEvent, removeEventListener: removeHideEvent } = registerEventListeners<CollapseEvents>('c.collapse.hide', collapseLoc)
  const { callback: hiddenEvent, removeEventListener: removeHiddenEvent } = registerEventListeners<CollapseEvents>('c.collapse.hidden', collapseLoc)

  const collapse = new Collapse(collapseLoc.element() as HTMLElement)

  // Show without transition — show and shown fire synchronously
  collapse.show()
  expect(showEvent).toHaveBeenCalledTimes(1)
  expect(shownEvent).toHaveBeenCalledTimes(1)
  expect(collapse.isExpanded).toBe(true)
  expect(collapse.isCollapsing).toBe(false)

  // Hide without transition — hide and hidden fire synchronously
  collapse.hide()
  expect(hideEvent).toHaveBeenCalledTimes(1)
  expect(hiddenEvent).toHaveBeenCalledTimes(1)
  expect(collapse.isExpanded).toBe(false)
  expect(collapse.isCollapsing).toBe(false)

  collapse.destroy()
  removeShowEvent()
  removeShownEvent()
  removeHideEvent()
  removeHiddenEvent()
})

it('collapse onStateChange callback', () => {
  const collapseLoc = page.getByTestId('collapse-notransition')
  const onStateChange = vi.fn()

  const collapse = new Collapse(collapseLoc.element() as HTMLElement, {
    onStateChange,
  })

  // Called during init
  expect(onStateChange).toHaveBeenCalled()

  const callCountAfterInit = onStateChange.mock.calls.length
  collapse.show()
  expect(onStateChange).toHaveBeenCalledWith(
    expect.objectContaining({ isExpanded: true, isCollapsing: false }),
  )
  expect(onStateChange.mock.calls.length).toBeGreaterThan(callCountAfterInit)

  collapse.destroy()
})

it('collapse show() while collapsing is blocked', async () => {
  const collapseLoc = page.getByTestId('collapse')
  const collapse = new Collapse(collapseLoc.element() as HTMLElement)

  // Start show (with transition)
  collapse.show()
  expect(collapse.isCollapsing).toBe(true)

  // Calling show() again while collapsing should be a no-op
  collapse.show()
  // Still collapsing from the first call
  expect(collapse.isCollapsing).toBe(true)

  await new Promise<void>(resolve => setTimeout(resolve, 300))
  expect(collapse.isExpanded).toBe(true)
  expect(collapse.isCollapsing).toBe(false)

  collapse.destroy()
})

it('collapse hide() while collapsing is blocked', async () => {
  const collapseLoc = page.getByTestId('collapse')
  const collapse = new Collapse(collapseLoc.element() as HTMLElement)

  // First expand it
  collapse.show()
  await new Promise<void>(resolve => setTimeout(resolve, 300))
  expect(collapse.isExpanded).toBe(true)

  // Start hide (with transition)
  collapse.hide()
  expect(collapse.isCollapsing).toBe(true)

  // Calling hide() again while collapsing should be a no-op
  collapse.hide()
  expect(collapse.isCollapsing).toBe(true)

  await new Promise<void>(resolve => setTimeout(resolve, 300))
  expect(collapse.isExpanded).toBe(false)
  expect(collapse.isCollapsing).toBe(false)

  collapse.destroy()
})
