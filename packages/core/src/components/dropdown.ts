import { generateId } from '../utils/accessibility'
import Parent, { type ParentOptions } from './_parent'

declare global {
  interface HTMLElementEventMap {
    'c.dropdown.init': CustomEvent<Dropdown>
    'c.dropdown.destroy': CustomEvent<Dropdown>
    'c.dropdown.opened': CustomEvent<Dropdown>
    'c.dropdown.closed': CustomEvent<Dropdown>
  }
}

export interface DropdownOptions extends ParentOptions {
  /**
   * Define open mode, by default you need to `click` on the trigger element
   * but you can configure it to display the dropdown on `hover`.
   * @default "click"
   */
  openOn?: 'hover' | 'click'
  /**
   * Use MutationObserver to update component on changes
   * @default true
   */
  mutationObserver?: boolean
}

export default class Dropdown extends Parent {
  declare public opts: DropdownOptions
  private triggerEl: HTMLButtonElement | HTMLLinkElement | null = null
  private menuEl: HTMLUListElement | null = null
  private opened: boolean

  private mutationObserver?: MutationObserver

  constructor(el: HTMLElement | string, options: DropdownOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'dropdown'

    this.triggerEl = this.el.querySelector(':scope > a, :scope > button')
    if (!this.triggerEl) {
      throw this.error(
        'The component needs to have a <button> or <a> element as a direct child',
        { cause: this.el },
      )
    }

    this.menuEl = this.el.querySelector(':scope > ul, :scope > div')
    if (!this.menuEl) {
      throw this.error(
        'The component needs to have a <ul> or a <div> element as a direct child',
        { cause: this.el },
      )
    }

    this.mutationObserver = this.opts.mutationObserver === false
      ? undefined
      : new MutationObserver(() => {
        this.update()
      })
    this.mutationObserver?.observe(this.el, {
      childList: true,
      subtree: true,
    })

    super.init()
  }

  public initAccessibilityAttrs() {
    if (!this.triggerEl || !this.menuEl)
      return
    this.triggerEl.setAttribute('aria-expanded', 'false')
    this.triggerEl.setAttribute('aria-haspopup', 'true')
    if (this.triggerEl.tagName === 'A')
      this.triggerEl.setAttribute('role', 'button')

    const id = this.menuEl.id || generateId()
    this.triggerEl.setAttribute('aria-controls', id)
    this.menuEl.setAttribute('id', id)

    if (this.menuEl.tagName !== 'UL')
      return
    this.menuEl.setAttribute('role', 'menu')
    const lis = this.menuEl.querySelectorAll(':scope > li')
    lis.forEach((li) => {
      li.setAttribute('role', 'none')
    })
    const actions = this.menuEl.querySelectorAll(':scope > li > button, :scope > li > a')
    actions.forEach((action) => {
      action.setAttribute('role', 'menuitem')
    })
  }

  public initEvents() {
    if (!this.triggerEl || !this.menuEl)
      return
    if (this.opts.openOn === 'hover') {
      this.destroyEvents([
        'triggerEnter',
        'triggerLeave',
        'menuEnter',
        'menuLeave',
      ])
      this.registerEvent({
        id: 'triggerEnter',
        el: this.triggerEl,
        event: 'mouseenter',
        function: this.open.bind(this),
      })
      this.registerEvent({
        id: 'triggerLeave',
        el: this.triggerEl,
        event: 'mouseleave',
        function: this.close.bind(this),
      })
      this.registerEvent({
        id: 'menuEnter',
        el: this.menuEl,
        event: 'mouseenter',
        function: this.open.bind(this),
      })
      this.registerEvent({
        id: 'menuLeave',
        el: this.menuEl,
        event: 'mouseleave',
        function: this.close.bind(this),
      })
    }
    else {
      this.destroyEvents([
        'click',
      ])
      this.registerEvent({
        id: 'click',
        el: this.triggerEl,
        event: 'click',
        function: this.toggle.bind(this),
      })
    }
  }

  /**
   * Update the dropdown component
   */
  public update() {
    if (this.accessibilityStatus.attrs === true)
      this.initAccessibilityAttrs()
  }

  /**
   * Open the dropdown
   */
  public open() {
    if (!this.triggerEl)
      return
    this.triggerEl.setAttribute('aria-expanded', 'true')
    this.opened = true
    this.emitEvent('opened')
  }

  /**
   * Close the dropdown
   */
  public close() {
    if (!this.triggerEl)
      return
    this.triggerEl.setAttribute('aria-expanded', 'false')
    this.opened = false
    this.emitEvent('closed')
  }

  /**
   * Toggle the dropdown
   */
  public toggle() {
    if (this.opened)
      this.close()
    else
      this.open()
  }

  public get isOpened() {
    return this.opened
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    super.destroy()
  }
}
