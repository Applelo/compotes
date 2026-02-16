import type { ParentOptions } from './_parent'
import { debounceMutationObserver } from '@src/utils/debounce'
import { focusFirst, focusLast, focusSibling, generateId } from '../utils/accessibility'
import Parent from './_parent'

export enum Events {
  Init = 'init',
  Opened = 'opened',
  Closed = 'closed',
  Destroy = 'destroy',
}

declare global {
  interface HTMLElementEventMap extends Record<`c.dropdown.${Events}`, CustomEvent<Dropdown>> {}
}

export interface DropdownOptions extends ParentOptions<Events> {
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

export interface DropdownState {
  isOpen: boolean
  type: 'default' | 'menu'
}

export default class Dropdown extends Parent<Events, DropdownOptions> {
  public readonly name = 'dropdown'
  declare protected opts: DropdownOptions

  // Constant
  private static readonly CLASS_ROOT = 'c-dropdown'
  private static readonly CLASS_WIDTH = 'c-dropdown--setwidth'
  private static readonly CLASS_TRIGGER = 'c-dropdown-trigger'
  private static readonly CLASS_CONTAINER = 'c-dropdown-container'

  private static readonly SELECTOR_ROOT = `.${Dropdown.CLASS_ROOT}`
  private static readonly SELECTOR_TRIGGER = `.${Dropdown.CLASS_TRIGGER}`
  private static readonly SELECTOR_CONTAINER = `.${Dropdown.CLASS_CONTAINER}`
  private static readonly SELECTOR_CONTAINER_ITEMS = ':scope > li'
  private static readonly SELECTOR_CONTAINER_ACTIONS = ':scope > li > button, :scope > li > a'

  private static readonly CSSVAR_WIDTH = '--c-dropdown-width'

  private triggerEl: HTMLButtonElement | HTMLLinkElement | null = null
  private menuEl: HTMLUListElement | null = null
  private opened: boolean = false
  private mutationObserver?: MutationObserver

  constructor(el?: HTMLElement | string, options: DropdownOptions = {}) {
    super()
    this.opts = options
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el?: HTMLElement | string, options?: DropdownOptions): void {
    super.init(el, options)

    /* istanbul ignore if -- @preserve */
    if (!this.el)
      return

    this.mutationObserver = this.opts.mutationObserver === false
      ? undefined
      : debounceMutationObserver(() => {
          this.update()
        })
    this.mutationObserver?.observe(this.el, {
      childList: true,
      characterData: this.opts.equalizeWidth === true,
      subtree: true,
    })

    this.opened = this.triggerEl?.getAttribute('aria-expanded') === 'true'

    this.update()
  }

  protected initElements(): void {
    this.triggerEl = this.el?.querySelector(Dropdown.SELECTOR_TRIGGER) || null
    if (!this.triggerEl) {
      throw this.error(
        'The component needs to have a trigger element with the class `c-dropdown-trigger` as a direct child',
        { cause: this.el },
      )
    }

    this.menuEl = this.el?.querySelector(Dropdown.SELECTOR_CONTAINER) || null
    if (!this.menuEl) {
      throw this.error(
        'The component needs to have a container element with the class `c-dropdown-container` as a direct child',
        { cause: this.el },
      )
    }
  }

  public initAccessibilityAttrs(): void {
    /* istanbul ignore if -- @preserve */
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
    const lis = this.menuEl.querySelectorAll(Dropdown.SELECTOR_CONTAINER_ITEMS)
    lis.forEach((li) => {
      li.setAttribute('role', 'none')
    })
    const actions = this.menuEl.querySelectorAll(Dropdown.SELECTOR_CONTAINER_ACTIONS)
    actions.forEach((action) => {
      action.setAttribute('role', 'menuitem')
    })
  }

  protected initEvents(): void {
    /* istanbul ignore if -- @preserve */
    if (!this.triggerEl || !this.menuEl)
      return
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
        /* istanbul ignore if -- @preserve */
        if (!target)
          return
        const dropdown = target.closest(Dropdown.SELECTOR_ROOT)
        if (!dropdown)
          this.close()
      },
    })

    if (this.opts.openOn === 'hover') {
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

    this.initAccessibilityEvents()
  }

  /**
   * Init accessibility events.
   */
  private initAccessibilityEvents(): void {
    /* istanbul ignore if -- @preserve */
    if (!this.el)
      return

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
        if (target?.closest(Dropdown.SELECTOR_ROOT) === this.el)
          return
        this.close()
      },
    })
  }

  /**
   * Update the dropdown component
   */
  public update(): void {
    this.initAccessibilityAttrs()

    if (this.opts.equalizeWidth === true)
      this.equalizeWidth()
  }

  /**
   * Open the dropdown
   */
  public open(): void {
    /* istanbul ignore if -- @preserve */
    if (!this.triggerEl)
      return
    this.triggerEl.setAttribute('aria-expanded', 'true')
    this.opened = true
    this.emitEvent(Events.Opened)
  }

  /**
   * Return the type of the dropdown
   *
   */
  public get type(): 'default' | 'menu' {
    if (this.opts.enforceType)
      return this.opts.enforceType
    return this.menuEl?.tagName === 'UL'
      ? 'menu'
      : 'default'
  }

  /**
   * Get and set the same width on the trigger and the container
   */
  public equalizeWidth(): void {
    setTimeout(() => {
      /* istanbul ignore if -- @preserve */
      if (!this.el || !this.triggerEl || !this.menuEl)
        return
      this.el.classList.remove(Dropdown.CLASS_WIDTH)
      this.el.style.removeProperty(Dropdown.CSSVAR_WIDTH)
      const triggerWidth = this.triggerEl.clientWidth
      const containerWidth = this.menuEl.clientWidth
      const maxWidth = Math.max(triggerWidth, containerWidth)
      this.el.style.setProperty(Dropdown.CSSVAR_WIDTH, `${Math.ceil(maxWidth)}px`)
      this.el.classList.add(Dropdown.CLASS_WIDTH)
    }, 1)
  }

  /**
   * Close the dropdown
   */
  public close(): void {
    /* istanbul ignore if -- @preserve */
    if (!this.triggerEl)
      return
    this.triggerEl.setAttribute('aria-expanded', 'false')
    this.opened = false
    this.emitEvent(Events.Closed)
  }

  /**
   * Toggle the dropdown
   */
  public toggle(): void {
    if (this.opened)
      this.close()
    else
      this.open()
  }

  /**
   * Return if the dropdown is opened
   */
  public get isOpen(): boolean {
    return this.opened
  }

  protected getState(): DropdownState {
    return {
      isOpen: this.opened,
      type: this.type,
    }
  }

  public destroy(): void {
    this.mutationObserver?.disconnect()
    if (this.triggerEl) {
      if (this.triggerEl.tagName !== 'BUTTON')
        this.triggerEl.removeAttribute('role')
      this.triggerEl.removeAttribute('aria-controls')
      this.triggerEl.removeAttribute('aria-expanded')
      this.triggerEl.removeAttribute('aria-haspopup')
    }

    if (this.menuEl && this.menuEl.id.startsWith('c-id-'))
      this.menuEl.removeAttribute('id')

    if (this.type === 'menu' && this.menuEl) {
      this.menuEl?.removeAttribute('role')
      const lis = this.menuEl.querySelectorAll(Dropdown.SELECTOR_CONTAINER_ITEMS)
      lis.forEach((li) => {
        li.removeAttribute('role')
      })
      const actions = this.menuEl.querySelectorAll(Dropdown.SELECTOR_CONTAINER_ACTIONS)
      actions.forEach((action) => {
        action.removeAttribute('role')
      })
    }
    this.el?.classList.remove(Dropdown.CLASS_WIDTH)
    this.el?.style.removeProperty(Dropdown.CSSVAR_WIDTH)
    if (this.el?.getAttribute('style')?.trim() === '')
      this.el.removeAttribute('style')
    super.destroy()
  }
}
