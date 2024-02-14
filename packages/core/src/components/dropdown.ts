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
   * Equalize width on the trigger and the container. It will refresh on mutation observer (if enable).
   * You can use `dropdown.equalizeWidth()` to equalize width manually.
   * @default false
   */
  equalizeWidth?: boolean
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
  private widthClass = 'c-dropdown--setwidth'
  private widthCssVar = '--c-dropdown-width'

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
      characterData: this.opts.equalizeWidth === true,
      subtree: true,
    })

    this.opened = this.triggerEl.getAttribute('aria-expanded') === 'true'

    this.update()
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
    this.destroyEvents(['click', 'pointerdown'])
    this.registerEvent({
      id: 'click',
      el: this.triggerEl,
      event: 'click',
      function: this.toggle.bind(this),
    })
    this.registerEvent({
      id: 'pointerdown',
      el: window,
      event: 'pointerdown',
      function: (e: PointerEvent) => {
        const target = e.target as Element | null
        if (!target)
          return
        const dropdown = target.closest('.c-dropdown')
        if (!dropdown)
          this.close()
      },
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
        event: 'pointerenter',
        function: (e: PointerEvent) => {
          if (e.pointerType === 'mouse')
            this.open()
        },
      })
      this.registerEvent({
        id: 'triggerLeave',
        el: this.triggerEl,
        event: 'pointerleave',
        function: (e: PointerEvent) => {
          if (e.pointerType === 'mouse')
            this.close()
        },
      })
      this.registerEvent({
        id: 'menuEnter',
        el: this.menuEl,
        event: 'pointerenter',
        function: (e: PointerEvent) => {
          if (e.pointerType === 'mouse')
            this.open()
        },
      })
      this.registerEvent({
        id: 'menuLeave',
        el: this.menuEl,
        event: 'pointerleave',
        function: (e: PointerEvent) => {
          if (e.pointerType === 'mouse')
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
    this.destroyEvents(['key', 'focusin'])

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

    this.registerEvent({
      id: 'focusin',
      event: 'focusin',
      el: window,
      function: (e: Event) => {
        const target = e.target as Element | null
        if (target?.closest('.c-dropdown') === this.el)
          return
        this.close()
      },
    })
  }

  /**
   * Update the dropdown component
   */
  public update() {
    if (this.accessibilityStatus.attrs === true)
      this.initAccessibilityAttrs()
    if (this.opts.equalizeWidth === true)
      this.equalizeWidth()
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
   * Get and set the same width on the trigger and the container
   */
  public equalizeWidth() {
    setTimeout(() => {
      if (!this.triggerEl || !this.menuEl)
        return
      this.el.classList.remove(this.widthClass)
      this.el.style.removeProperty(this.widthCssVar)
      const triggerWidth = this.triggerEl.clientWidth
      const containerWidth = this.menuEl.clientWidth
      const maxWidth = Math.max(triggerWidth, containerWidth)
      this.el.style.setProperty(this.widthCssVar, `${Math.ceil(maxWidth)}px`)
      this.el.classList.add(this.widthClass)
    }, 1)
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
    if (this.triggerEl) {
      if (this.triggerEl.tagName !== 'BUTTON')
        this.triggerEl.removeAttribute('role')
      this.triggerEl.removeAttribute('aria-controls')
    }

    if (this.menuEl && this.menuEl.id.startsWith('c-id-'))
      this.menuEl.removeAttribute('id')

    if (this.type === 'menu' && this.menuEl) {
      this.menuEl?.removeAttribute('role')
      const lis = this.menuEl.querySelectorAll(':scope > li')
      lis.forEach((li) => {
        li.removeAttribute('role')
      })
      const actions = this.menuEl.querySelectorAll(':scope > li > button, :scope > li > a')
      actions.forEach((action) => {
        action.removeAttribute('role')
      })
    }
    this.el.classList.remove(this.widthClass)
    super.destroy()
  }
}
