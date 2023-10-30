import ErrorCompotes from '../utils/error'

export interface ParentOptions {
  /**
   * Init the component on creation.
   * @default true
   */
  init?: boolean
  /**
   * Init accessibility attributes on the component.
   * Don't disable it if you don't know what your doing
   * @default true
   */
  initAccessibilityAttrs?: boolean
  /**
   * Init events on the component.
   * Don't disable it if you don't know what your doing
   * @default true
   */
  initEvents?: boolean
}

export interface ParentEvent {
  id: string
  event: string
  function: any
  el: Element
}

export default abstract class Parent {
  protected name = ''
  public el: HTMLElement
  public opts: ParentOptions
  protected events: ParentEvent[] = []

  constructor(el: HTMLElement | string, options: ParentOptions = {}) {
    const checkEl = typeof el === 'string' ? document.querySelector<HTMLElement>(el) : el
    if (!checkEl)
      throw this.error('The element/selector provided cannot be found.')

    this.el = checkEl

    this.opts = options
  }

  protected get isInitializable() {
    return typeof this.opts.init === 'undefined' || this.opts.init === true
  }

  /**
   * Emit an event
   */
  protected emitEvent(name: string, cancelable = false) {
    const event = new CustomEvent<this>(
      `c.${this.name}.${name}`,
      {
        detail: this,
        cancelable,
      },
    )
    return this.el.dispatchEvent(event)
  }

  /**
   * Init the component
   */
  public init() {
    this.emitEvent('init')
    if (typeof this.opts.initAccessibilityAttrs === 'undefined' || this.opts.initAccessibilityAttrs)
      this.initAccessibilityAttrs()
    if (typeof this.opts.initEvents === 'undefined' || this.opts.initEvents)
      this.initEvents()
  }

  /**
   * Init the accessibility on the component
   */
  protected abstract initAccessibilityAttrs(): void

  /**
   * Init events on the component
   */
  protected abstract initEvents(): void

  /**
   * Register an event
   */
  protected registerEvent(e: ParentEvent) {
    e.el.addEventListener(e.event, e.function)
    this.events.push(e)
  }

  /**
   * Destroy the events on the component
   */
  public destroyEvents(filters: string[] = []) {
    const events = filters.length ? this.events.filter(e => filters.includes(e.id)) : this.events
    events.forEach((e) => {
      e.el.removeEventListener(e.event, e.function)
    })
    this.events = this.events.filter(e => !events.includes(e))
  }

  /**
   * Destroy the component
   */
  public destroy() {
    this.emitEvent('destroy')
    this.destroyEvents()
  }

  /**
   * Options of the component
   */
  public get options(): ParentOptions {
    return this.opts
  }

  /**
   * Generate an error message
   * Can be use with `throw` or directly inside `console.error(`)`
   */
  protected error(msg: string, params?: ErrorOptions) {
    return new ErrorCompotes(msg, params, this.name)
  }
}
