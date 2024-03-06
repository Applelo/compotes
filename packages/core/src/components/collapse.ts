import type { ParentOptions } from './_parent'
import Parent from './_parent'
import { getTransitionDuration } from './../utils/animation'

type Events = 'init' | 'destroy' | 'show' | 'shown' | 'hide' | 'hidden' | 'destroy'

declare global {
  interface HTMLElementEventMap extends Record<`c.collapse.${Events}`, CustomEvent<Collapse>> {}
}

export interface CollapseOptions extends ParentOptions<Events> {}

export default class Collapse extends Parent<Events> {
  declare public opts: CollapseOptions
  private triggers: HTMLElement[] = []
  private expanded = false
  private collapsing = false
  private timeout: number | undefined = undefined
  private showClass = 'c-collapse--show'
  private collapsingClass = 'c-collapse--collapsing'

  constructor(el: HTMLElement | string, options: CollapseOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'collapse'
    this.expanded = this.el.classList.contains(this.showClass)
    this.update()
    super.init()
  }

  public initAccessibilityAttrs() {
    this.triggers.forEach((trigger) => {
      if (trigger.tagName !== 'BUTTON')
        trigger.setAttribute('role', 'button')
    })
  }

  public initEvents() {
    this.destroyEvents()
    this.triggers.forEach((item) => {
      this.registerEvent({
        id: 'toggle',
        function: this.toggle.bind(this),
        event: 'click',
        el: item,
      })
    })
  }

  /**
   * Update trigger status
   */
  public update() {
    this.triggers = Array.from(
      document.querySelectorAll<HTMLElement>(`.c-collapse-trigger[aria-controls="${this.el.id}"]`),
    )
    this.triggers.forEach((trigger) => {
      trigger.setAttribute(
        'aria-expanded',
        this.expanded ? 'true' : 'false',
      )
    })
    this.emitEvent('update')
  }

  /**
   * Toggle collapse
   */
  public toggle() {
    this.expanded ? this.hide() : this.show()
  }

  /**
   * Show collapse
   */
  public show() {
    this.expanded = true
    if (this.hasTransition) {
      this.collapsing = true
      this.el.classList.add(this.collapsingClass)
      const height = this.el.scrollHeight
      this.el.style.height = `${height}px`
      this.onCollapse()
    }
    else {
      this.emitEvent('shown')
    }
    this.el.classList.add(this.showClass)
    this.update()
  }

  /**
   * Hide collapse
   */
  public hide() {
    this.expanded = false
    if (this.hasTransition) {
      const height = this.el.scrollHeight
      this.el.style.height = `${height}px`
      // eslint-disable-next-line no-unused-expressions
      this.el.offsetHeight // reflow
      this.collapsing = true
      this.el.classList.add(this.collapsingClass)
      this.el.style.height = '0px'
      this.onCollapse()
    }
    else {
      this.emitEvent('hidden')
    }
    this.el.classList.remove(this.showClass)

    this.update()
  }

  private onCollapse() {
    clearTimeout(this.timeout)
    this.emitEvent(this.expanded ? 'show' : 'hide')

    this.timeout = window.setTimeout(() => {
      this.el.classList.remove(this.collapsingClass)
      this.collapsing = false
      this.el.style.height = ''

      this.emitEvent(this.expanded ? 'shown' : 'hidden')
    }, getTransitionDuration(this.el))
  }

  /**
   * Return the status of the collapse
   */
  public get isExpanded() {
    return this.expanded
  }

  /**
   * Return if the collapse is collapsing
   */
  public get isCollapsing() {
    return this.collapsing
  }

  private get hasTransition() {
    return getTransitionDuration(this.el) !== 0
  }

  public destroy(): void {
    this.el.classList.remove(this.collapsingClass)
    this.triggers.forEach((trigger) => {
      trigger.removeAttribute('aria-expanded')
    })
    super.destroy()
  }
}
