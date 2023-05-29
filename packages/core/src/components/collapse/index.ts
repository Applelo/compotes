import Parent, { type ParentOptions } from '../_parent'

export default class Collapse extends Parent {
  private triggers: HTMLElement[] = []
  constructor(el: HTMLElement | string, options: ParentOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'collapse'
    this.update()
    super.init()
  }

  protected initAccessibilityAttrs(): void {
    this.triggers.forEach((trigger) => {
      if (trigger.tagName !== 'BUTTON')
        trigger.setAttribute('role', 'button')
      const expanded = trigger.ariaExpanded
      if (!expanded)
        trigger.setAttribute('aria-expanded', 'false')
    })
  }

  protected initEvents(): void {
    this.destroyEvents(['toggle'])
    this.triggers.forEach((item) => {
      this.registerEvent({
        id: 'toggle',
        function: this.toggle.bind(this),
        event: 'click',
        el: item,
      })
    })
  }

  public update() {
    this.triggers = Array.from(
      document.querySelectorAll<HTMLElement>('.c-collapse-trigger'),
    )
    this.triggers.forEach((trigger) => {
      const id = trigger.getAttribute('aria-controls')
      if (!id) {
        const error = this.error(
          'The trigger element doesn\'t have an aria-controls attribute.',
          { cause: trigger },
        )
        console.error(error)
      }
    })
  }

  public toggle(e: Event) {
    console.log('toogle')
  }
}
