import Parent, { type ParentOptions } from './_parent'

declare global {
  interface HTMLElementEventMap {
    'c.dropdown.init': CustomEvent<Dropdown>
    'c.dropdown.destroy': CustomEvent<Dropdown>
  }
}

export default class Dropdown extends Parent {
  constructor(el: HTMLElement | string, options: ParentOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'dropdown'
    super.init()
  }

  public initAccessibilityAttrs() {

  }

  public initEvents() {
    this.destroyEvents()

    if (!this.accessibilityStatus.events)
      return

    this.registerEvent({
      id: 'addKeyboardClass',
      function: (e: KeyboardEvent) => {
        if (e.key === 'Escape')
          this.el.classList.remove('c-dropdown--keyboard')
        else
          this.el.classList.add('c-dropdown--keyboard')
      },
      event: 'keydown',
      el: this.el,
    })

    this.registerEvent({
      id: 'removeKeyboardClass',
      function: (e: FocusEvent) => {
        const target = e.target as Element
        if (
          target.classList.contains('.c-dropdown')
          || target.closest('.c-dropdown')
        )
          return
        this.el.classList.remove('c-dropdown--keyboard')
      },
      event: 'focusout',
      el: this.el,
    })
  }

  public destroy() {
    super.destroy()
  }
}
