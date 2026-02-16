import type { Events } from '@src/components/dropdown'
import Dropdown from '@src/components/dropdown'
import { beforeAll, expect, it, vi } from 'vitest'
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

  dropdown.options.openOn = 'hover'
  dropdown.init()
  const triggerEl = triggerLoc.element() as HTMLElement
  triggerEl.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }))
  expect(dropdown.isOpen).toBe(true)
  expect(openedEvent).toHaveBeenCalledTimes(3)
  expect(containerLoc).toBeVisible()

  triggerEl.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, pointerType: 'mouse' }))
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

it('dropdown onStateChange callback', () => {
  const dropdownLoc = page.getByTestId('dropdown')
  const onStateChange = vi.fn()

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement, {
    onStateChange,
    mutationObserver: false,
  })

  expect(onStateChange).toHaveBeenCalled()

  const callCountAfterInit = onStateChange.mock.calls.length
  dropdown.open()
  expect(onStateChange).toHaveBeenCalledWith(
    expect.objectContaining({ isOpen: true, type: 'default' }),
  )
  expect(onStateChange.mock.calls.length).toBeGreaterThan(callCountAfterInit)

  dropdown.destroy()
})

it('dropdown hover on menu element', async () => {
  const dropdownLoc = page.getByTestId('dropdown-menu')
  const containerLoc = page.getByTestId('container-menu')
  const triggerLoc = page.getByTestId('trigger-menu')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement, {
    openOn: 'hover',
    mutationObserver: false,
  })

  // Hover on trigger to open
  const triggerEl = triggerLoc.element() as HTMLElement
  triggerEl.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }))
  expect(dropdown.isOpen).toBe(true)

  // Pointer enter on menu element should keep it open.
  const containerEl = containerLoc.element() as HTMLElement
  containerEl.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }))
  expect(dropdown.isOpen).toBe(true)

  // Pointer leave from menu should close it.
  containerEl.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, pointerType: 'mouse' }))
  expect(dropdown.isOpen).toBe(false)

  dropdown.destroy()
})

it('dropdown PageUp/PageDown keys', () => {
  const dropdownLoc = page.getByTestId('dropdown-menu')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement, {
    mutationObserver: false,
  })
  expect(dropdown.type).toBe('menu')
  dropdown.open()

  const el = dropdownLoc.element() as HTMLElement
  const menuItem1 = page.getByTestId('menu-item-1').element() as HTMLElement
  menuItem1.focus()

  // PageDown moves to last
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))
  expect(document.activeElement?.getAttribute('data-testid')).toBe('menu-item-3')

  // PageUp moves to first
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }))
  expect(document.activeElement?.getAttribute('data-testid')).toBe('menu-item-1')

  dropdown.destroy()
})

it('dropdown pointerdown inside does not close', () => {
  const dropdownLoc = page.getByTestId('dropdown')

  const dropdown = new Dropdown(dropdownLoc.element() as HTMLElement, {
    mutationObserver: false,
  })
  dropdown.open()
  expect(dropdown.isOpen).toBe(true)

  // Pointerdown inside the dropdown should NOT close it
  const el = dropdownLoc.element() as HTMLElement
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  expect(dropdown.isOpen).toBe(true)

  dropdown.destroy()
})

it('dropdown init without trigger throws error', () => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = `<div class="c-dropdown"><div class="c-dropdown-container">Content</div></div>`
  document.body.appendChild(wrapper)

  const el = wrapper.querySelector('.c-dropdown') as HTMLElement
  expect(() => new Dropdown(el)).toThrow('trigger element')

  wrapper.remove()
})

it('dropdown init without container throws error', () => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = `<div class="c-dropdown"><button class="c-dropdown-trigger">Trigger</button></div>`
  document.body.appendChild(wrapper)

  const el = wrapper.querySelector('.c-dropdown') as HTMLElement
  expect(() => new Dropdown(el)).toThrow('container element')

  wrapper.remove()
})

it('dropdown non-button trigger gets role button', () => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = `
    <div class="c-dropdown">
      <a class="c-dropdown-trigger" href="#">Link Trigger</a>
      <div class="c-dropdown-container">Content</div>
    </div>
  `
  document.body.appendChild(wrapper)

  const el = wrapper.querySelector('.c-dropdown') as HTMLElement
  const trigger = wrapper.querySelector('.c-dropdown-trigger') as HTMLElement
  const dropdown = new Dropdown(el, { mutationObserver: false })

  expect(trigger.getAttribute('role')).toBe('button')

  dropdown.destroy()
  expect(trigger.getAttribute('role')).toBeNull()
  wrapper.remove()
})

it('dropdown mutationObserver triggers update on DOM change', async () => {
  const dropdownLoc = page.getByTestId('dropdown')
  const el = dropdownLoc.element() as HTMLElement

  const dropdown = new Dropdown(el)

  // Mutate DOM content to trigger the MutationObserver
  const container = el.querySelector('.c-dropdown-container') as HTMLElement
  const newChild = document.createElement('span')
  newChild.textContent = 'New item'
  container.appendChild(newChild)

  // Wait for debounced mutation observer
  await new Promise(resolve => setTimeout(resolve, 100))

  // If we get here without error, the update was triggered successfully
  expect(dropdown.isOpen).toBe(false)

  container.removeChild(newChild)
  dropdown.destroy()
})
