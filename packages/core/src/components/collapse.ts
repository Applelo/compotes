import type { ParentOptions } from './_parent'
import { getTransitionDuration } from './../utils/animation'
import Parent from './_parent'

enum Events {
  Show = 'show',
  Shown = 'shown',
  Hide = 'hide',
  Hidden = 'hidden',
  Update = 'update',
}

declare global {
  interface HTMLElementEventMap extends Record<`c.collapse.${Events}`, CustomEvent<Collapse>> {}
}

export interface CollapseOptions extends ParentOptions<Events> {}

export default class Collapse extends Parent<Events> {
  public readonly name = 'collapse'
  declare protected opts: CollapseOptions

  // Constant
  private static readonly CLASS_SHOW = 'c-collapse--show'
  private static readonly CLASS_COLLAPSING = 'c-collapse--collapsing'
  private static readonly CLASS_TRIGGER = 'c-collapse-trigger'

  private triggers: HTMLElement[] = []
  protected status = {
    expanded: false,
    collapsing: false,
  }

  private timeout: number | undefined = undefined

  constructor(el: HTMLElement | string, options: CollapseOptions = {}) {
    super()
    this.opts = options
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el: HTMLElement | string, options?: CollapseOptions) {
    super.init(el, options)
    this.initAccessibilityAttrs()

    this.status.expanded = this.el?.classList.contains(Collapse.CLASS_SHOW) || false

    this.update()
  }

  public initElements(): void {
    this.setTriggers()
  }

  public initAccessibilityAttrs() {
    this.triggers.forEach((trigger) => {
      if (trigger.tagName !== 'BUTTON')
        trigger.setAttribute('role', 'button')
    })
  }

  public initEvents() {
    this.triggers.forEach((item) => {
      this.registerEvent({
        id: 'toggle',
        function: this.toggle.bind(this),
        event: 'click',
        el: item,
      })
    })
  }

  private setTriggers() {
    this.triggers = Array.from(
      document.querySelectorAll<HTMLElement>(
        `.${Collapse.CLASS_TRIGGER}[aria-controls="${this.el?.id}"]`,
      ),
    )
  }

  /**
   * Update trigger status
   */
  public update() {
    this.setTriggers()
    this.triggers.forEach((trigger) => {
      trigger.setAttribute(
        'aria-expanded',
        this.status.expanded ? 'true' : 'false',
      )
    })
    this.emitEvent(Events.Update)
  }

  /**
   * Toggle collapse
   */
  public toggle() {
    if (this.status.expanded) {
      this.hide()
    }
    else {
      this.show()
    }
  }

  /**
   * Show collapse
   */
  public show() {
    if (!this.el)
      return

    this.status.expanded = true
    if (this.hasTransition) {
      this.status.collapsing = true
      this.el?.classList.add(Collapse.CLASS_COLLAPSING)
      const height = this.el.scrollHeight
      this.el.style.height = `${height}px`
      this.onCollapse()
    }
    else {
      this.emitEvent(Events.Show)
      this.emitEvent(Events.Shown)
    }
    this.el.classList.add(Collapse.CLASS_SHOW)
    this.update()
  }

  /**
   * Hide collapse
   */
  public hide() {
    if (!this.el)
      return

    this.status.expanded = false
    if (this.hasTransition) {
      const height = this.el.scrollHeight
      this.el.style.height = `${height}px`
      this.status.collapsing = true
      this.el.classList.add(Collapse.CLASS_COLLAPSING)
      this.el.style.height = '0px'
      this.onCollapse()
    }
    else {
      this.emitEvent(Events.Hide)
      this.emitEvent(Events.Hidden)
    }
    this.el.classList.remove(Collapse.CLASS_SHOW)
    this.update()
  }

  private onCollapse() {
    if (!this.el)
      return

    clearTimeout(this.timeout)
    this.emitEvent(this.status.expanded ? Events.Show : Events.Hide)

    this.timeout = window.setTimeout(() => {
      if (!this.el)
        return

      this.el.classList.remove(Collapse.CLASS_COLLAPSING)
      this.status.collapsing = false
      this.el.style.height = ''

      this.emitEvent(this.status.expanded ? Events.Shown : Events.Hidden)
    }, getTransitionDuration(this.el))
  }

  /**
   * Return the status of the collapse
   */
  public get isExpanded() {
    return this.status.expanded
  }

  /**
   * Return if the collapse is collapsing
   */
  public get isCollapsing() {
    return this.status.collapsing
  }

  private get hasTransition() {
    if (!this.el)
      return false
    return getTransitionDuration(this.el) !== 0
  }

  public destroy(): void {
    this.el?.classList.remove(Collapse.CLASS_COLLAPSING)
    this.triggers.forEach((trigger) => {
      trigger.removeAttribute('aria-expanded')
    })
    super.destroy()
  }
}
