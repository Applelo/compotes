import { focusFirst, focusLast, focusSibling, generateId } from '../utils/accessibility'
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
   * Enforce the dropdown menu type.
   * By default, it will detect the container element to apply the dropdown type.
   * @default undefined
   */
  enforceType?: 'default' | 'menu'
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
  private opened: boolean = false

  private mutationObserver?: MutationObserver

  constructor(el: HTMLElement | string, options: DropdownOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'dropdown'

    this.triggerEl = this.el.querySelector('.c-dropdown-trigger')
    if (!this.triggerEl) {
      throw this.error(
        'The component needs to have a trigger element with the class `c-dropdown-trigger` as a direct child',
        { cause: this.el },
      )
    }

    this.menuEl = this.el.querySelector('.c-dropdown-container')
    if (!this.menuEl) {
      throw this.error(
        'The component needs to have a container element with the class `c-dropdown-trigger` as a direct child',
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
    this.opened = this.triggerEl.getAttribute('aria-expanded') === 'true'

    super.init()
  }

  public initAccessibilityAttrs() {
    if (!this.triggerEl || !this.menuEl)
      return
    this.triggerEl.setAttribute('aria-expanded', this.opened ? 'true' : 'false')
    this.triggerEl.setAttribute('aria-haspopup', 'true')
    if (this.triggerEl.tagName !== 'BUTTON')
      this.triggerEl.setAttribute('role', 'button')

    const id = this.menuEl.id || generateId()
    this.triggerEl.setAttribute('aria-controls', id)
    this.menuEl.setAttribute('id', id)

    if (this.type === 'default')
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
    this.destroyEvents(['click'])
    this.registerEvent({
      id: 'click',
      el: this.triggerEl,
      event: 'click',
      function: this.toggle.bind(this),
    })
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
      this.destroyEvents(['mousedown'])
      this.registerEvent({
        id: 'mousedown',
        el: window,
        event: 'mousedown',
        function: (e: MouseEvent) => {
          const target = e.target as Element | null
          if (!target)
            return
          const dropdown = target.closest('.c-dropdown')
          if (!dropdown)
            this.close()
        },
      })
    }
    if (this.accessibilityStatus.events)
      this.initAccessibilityEvents()
  }

  /**
   * Init accessibility events.
   */
  public initAccessibilityEvents() {
    this.destroyEvents(['key', 'focusOut'])

    this.registerEvent({
      id: 'key',
      event: 'keydown',
      el: this.el,
      function: (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            this.close()
            this.triggerEl?.focus()
            break
          case 'ArrowUp':
          case 'Up':
            // Focus to previous element
            if (this.menuEl && this.type === 'menu')
              focusSibling(this.menuEl, 'previous')
            break
          case 'ArrowDown':
          case 'Down':
            // Focus to next element
            if (this.menuEl && this.type === 'menu')
              focusSibling(this.menuEl, 'next')
            break
          case 'Home':
          case 'PageUp':
            // Moves focus to the first item in the submenu.
            if (this.menuEl && this.type === 'menu')
              focusFirst(this.menuEl)
            break
          case 'End':
          case 'PageDown':
            // Moves focus to the last item in the submenu.
            if (this.menuEl && this.type === 'menu')
              focusLast(this.menuEl)
            break
        }
      },
    })
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
   * Return the type of the dropdown
   *
   */
  public get type() {
    if (this.opts.enforceType)
      return this.opts.enforceType
    return this.menuEl?.tagName === 'UL'
      ? 'menu'
      : 'default'
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

  /**
   * Return if the dropdown is opened
   */
  public get isOpen() {
    return this.opened
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    super.destroy()
  }
}
