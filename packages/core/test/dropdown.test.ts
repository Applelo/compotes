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
  <div class="c-dropdown" data-testid="dropdown-menu">
    <button class="c-dropdown-trigger" data-testid="trigger-menu">
      Menu Dropdown
    </button>
    <ul class="c-dropdown-container" data-testid="container-menu">
      <li><button data-testid="menu-item-1">Item 1</button></li>
      <li><button data-testid="menu-item-2">Item 2</button></li>
      <li><button data-testid="menu-item-3">Item 3</button></li>
    </ul>
  </div>
  <button data-testid="outside-button">Outside</button>
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

it('dropdown keyboard navigation (Escape)', async () => {
  const dropdownLoc = page.getByTestId('dropdown')
  const triggerLoc = page.getByTestId('trigger')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement)

  dropdown.open()
  expect(dropdown.isOpen).toBe(true)

  // Escape should close and focus trigger
  const el = dropdownLoc.element() as HTMLElement
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  expect(dropdown.isOpen).toBe(false)
  expect(document.activeElement).toBe(triggerLoc.element())

  dropdown.destroy()
})

it('dropdown menu type keyboard navigation', async () => {
  const dropdownLoc = page.getByTestId('dropdown-menu')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement)
  expect(dropdown.type).toBe('menu')

  dropdown.open()

  const el = dropdownLoc.element() as HTMLElement
  const menuItem1 = page.getByTestId('menu-item-1').element() as HTMLElement
  menuItem1.focus()

  // ArrowDown moves to next
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement?.getAttribute('data-testid')).toBe('menu-item-2')

  // ArrowUp moves to previous
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
  expect(document.activeElement?.getAttribute('data-testid')).toBe('menu-item-1')

  // Home moves to first
  const menuItem3 = page.getByTestId('menu-item-3').element() as HTMLElement
  menuItem3.focus()
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  expect(document.activeElement?.getAttribute('data-testid')).toBe('menu-item-1')

  // End moves to last
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  expect(document.activeElement?.getAttribute('data-testid')).toBe('menu-item-3')

  dropdown.destroy()
})

it('dropdown outside click closes', () => {
  const dropdownLoc = page.getByTestId('dropdown')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement)
  dropdown.open()
  expect(dropdown.isOpen).toBe(true)

  // Pointerdown outside dropdown should close it
  const outsideBtn = page.getByTestId('outside-button').element() as HTMLElement
  outsideBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  expect(dropdown.isOpen).toBe(false)

  dropdown.destroy()
})

it('dropdown focusin outside closes', () => {
  const dropdownLoc = page.getByTestId('dropdown')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement)
  dropdown.open()
  expect(dropdown.isOpen).toBe(true)

  // Focus outside the dropdown
  const outsideBtn = page.getByTestId('outside-button').element() as HTMLElement
  outsideBtn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
  expect(dropdown.isOpen).toBe(false)

  dropdown.destroy()
})

it('dropdown enforceType option', () => {
  const dropdownLoc = page.getByTestId('dropdown')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement, { enforceType: 'menu' })
  expect(dropdown.type).toBe('menu')
  dropdown.destroy()
})

it('dropdown auto-detects menu type with ul container', () => {
  const dropdownLoc = page.getByTestId('dropdown-menu')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement)
  expect(dropdown.type).toBe('menu')
  dropdown.destroy()
})

it('dropdown equalizeWidth option', async () => {
  const dropdownLoc = page.getByTestId('dropdown')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement, { equalizeWidth: true })

  // Wait for the setTimeout(1) in equalizeWidth
  await new Promise(resolve => setTimeout(resolve, 50))

  const el = dropdownLoc.element() as HTMLElement
  const cssVar = el.style.getPropertyValue('--c-dropdown-width')
  expect(cssVar).toBeTruthy()
  expect(el.classList.contains('c-dropdown--setwidth')).toBe(true)

  dropdown.destroy()
})

it('dropdown mutationObserver false disables observer', () => {
  const dropdownLoc = page.getByTestId('dropdown')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement, { mutationObserver: false })
  // Should work fine without observer
  expect(dropdown.isOpen).toBe(false)
  dropdown.open()
  expect(dropdown.isOpen).toBe(true)
  dropdown.destroy()
})
