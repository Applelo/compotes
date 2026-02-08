import type { Events } from '@src/components/dropdown'
import Dropdown from '@src/components/dropdown'
import { beforeAll, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { registerEventListeners } from './helper'
import '@css/dropdown.css'

type DropdownEvents = `c.dropdown.${Events}`

let bodyHTML: string = ''

beforeAll(() => {
  const html = `
  <div class="c-dropdown" data-testid="dropdown">
    <button class="c-dropdown-trigger" data-testid="trigger">
      Basic Dropdown
    </button>
    <div class="c-dropdown-container" id="dropdown-container" data-testid="container">
      Hello World
    </div>
  </div>
`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return () => {
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('dropdown', async () => {
  const dropdownLoc = page.getByTestId('dropdown')
  const triggerLoc = page.getByTestId('trigger')
  const containerLoc = page.getByTestId('container')

  expect(dropdownLoc).toBeInTheDocument()
  expect(triggerLoc).toBeInTheDocument()
  expect(containerLoc).toBeInTheDocument()

  const { callback: openedEvent, removeEventListener: removeOpenedEvent } = registerEventListeners<DropdownEvents>('c.dropdown.opened', dropdownLoc)
  const { callback: closedEvent, removeEventListener: removeClosedEvent } = registerEventListeners<DropdownEvents>('c.dropdown.closed', dropdownLoc)

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement)
  expect(dropdownLoc.element()).toMatchSnapshot()

  expect(containerLoc).not.toBeVisible()

  // Click
  await userEvent.click(triggerLoc)
  expect(dropdown.isOpen).toBe(true)
  expect(openedEvent).toHaveBeenCalledTimes(1)
  expect(containerLoc).toBeVisible()

  await userEvent.click(triggerLoc)
  expect(dropdown.isOpen).toBe(false)
  expect(closedEvent).toHaveBeenCalledTimes(1)
  expect(containerLoc).not.toBeVisible()

  // JS Method
  dropdown.open()
  expect(dropdown.isOpen).toBe(true)
  expect(openedEvent).toHaveBeenCalledTimes(2)
  expect(containerLoc).toBeVisible()

  dropdown.close()
  expect(dropdown.isOpen).toBe(false)
  expect(closedEvent).toHaveBeenCalledTimes(2)
  expect(containerLoc).not.toBeVisible()

  dropdown.destroy()
  // Ensure pointer isn't already over the trigger so hover re-enters.
  await userEvent.unhover(triggerLoc)

  dropdown.options.openOn = 'hover'
  dropdown.init()
  await userEvent.hover(triggerLoc)
  expect(dropdown.isOpen).toBe(true)
  expect(openedEvent).toHaveBeenCalledTimes(3)
  expect(containerLoc).toBeVisible()

  await userEvent.unhover(triggerLoc)
  expect(dropdown.isOpen).toBe(false)
  expect(closedEvent).toHaveBeenCalledTimes(3)
  expect(containerLoc).not.toBeVisible()

  dropdown.destroy()

  removeOpenedEvent()
  removeClosedEvent()
})
