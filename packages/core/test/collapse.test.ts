import type { Events } from '@src/components/collapse'
import Collapse from '@src/components/collapse'
import { beforeAll, expect, it } from 'vitest'
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
    <div
    class="c-collapse"
    id="accordion-1"
    data-testid="collapse"
    style="transition: height 0.2s;">
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
      </p>
    </div>
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
