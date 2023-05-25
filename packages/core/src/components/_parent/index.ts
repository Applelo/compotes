export interface ParentOptions {
  /**
   * Init the component on creation
   */
  init?: boolean
  /**
   * Init accessibility attributes on the component
   * Don't disable it if you don't know what your doing
   */
  initAccessibilityAttrs?: boolean
}

export interface ParentEvent {
  event: string
  function: any
  el: Element
}

export default abstract class Parent {
  protected el: HTMLElement
  public opts: ParentOptions
  protected events: ParentEvent[] = []

  constructor(el: HTMLElement | string, options: ParentOptions) {
    const checkEl = typeof el === 'string' ? document.querySelector<HTMLElement>(el) : el
    if (!checkEl)
      throw new Error('The element/selector provided cannot be found')

    this.el = checkEl

    this.opts = options
  }

  protected get isInitializable() {
    return typeof this.opts.init === 'undefined' || this.opts.init === true
  }

  protected emitEvent(name: string) {
    const event = new CustomEvent(name, { detail: this })
    this.el.dispatchEvent(event)
  }

  /**
   * Init the component
   */
  protected init(): void {
    this.emitEvent('init')
    if (typeof this.opts.initAccessibilityAttrs === 'undefined' || this.opts.initAccessibilityAttrs)
      this.initAccessibilityAttrs()
  }

  /**
   * Init the accessibility on the component
   */
  protected abstract initAccessibilityAttrs(): void

  /**
   * Destroy the events on the component
   */
  public destroyEvents() {
    this.events.forEach((e) => {
      e.el.removeEventListener(e.event, e.function)
    })
  }

  /**
   * Destroy the component
   */
  protected destroy(): void {
    this.emitEvent('destroy')
    this.destroyEvents()
  }

  /**
   * The HTML Element associated to the component
   */
  public get element(): HTMLElement {
    return this.el
  }

  /**
   * Options of the component
   */
  public get options(): ParentOptions {
    return this.opts
  }
}
