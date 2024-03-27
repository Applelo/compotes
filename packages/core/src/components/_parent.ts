import ErrorCompotes from '../utils/error'

export interface ParentOptions<E extends string> {
  /**
   * Init the component on creation.
   * @default true
   */
  init?: boolean
  /**
   * Init accessibility on the component.
   * Don't disable it if you don't know what your doing
   * @default true
   */
  initAccessibility?: boolean | {
    attrs?: boolean
    events?: boolean
    styles?: boolean
  }
  /**
   * Init events on the component.
   * Don't disable it if you don't know what your doing
   * @default true
   */
  initEvents?: boolean
  /**
   * An object to instantiate events listeners
   * @default undefined
   */
  on?: Partial<Record<E, (e: CustomEvent<Parent>) => void | undefined>>
}

export interface ParentEvent {
  id: string
  event: keyof HTMLElementEventMap
  function: any
  el: Element | Window
}

export default abstract class Parent<E extends string = 'init' | 'destroy'> {
  protected name = ''
  public el: HTMLElement
  public opts: ParentOptions<E>
  protected events: ParentEvent[] = []

  constructor(el: HTMLElement | string, options: ParentOptions<E> = {}) {
    const checkEl = typeof el === 'string'
      ? document.querySelector<HTMLElement>(el)
      : el

    if (!checkEl)
      throw this.error('The element/selector provided cannot be found.')

    this.el = checkEl
    this.opts = options
  }

  protected get isInitializable() {
    return typeof this.opts.init === 'undefined' || this.opts.init === true
  }

  protected get accessibilityStatus() {
    if (typeof this.opts.initAccessibility === 'object') {
      return {
        attrs: typeof this.opts.initAccessibility.attrs === 'undefined' || this.opts.initAccessibility.attrs === true,
        events: typeof this.opts.initAccessibility.events === 'undefined' || this.opts.initAccessibility.events === true,
        styles: typeof this.opts.initAccessibility.styles === 'undefined' || this.opts.initAccessibility.styles === true,
      }
    }
    else {
      const status = typeof this.opts.initAccessibility === 'undefined' || this.opts.initAccessibility === true
      return {
        attrs: status,
        events: status,
        styles: status,
      }
    }
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
    if (this.opts.on) {
      for (const key in this.opts.on) {
        if (Object.prototype.hasOwnProperty.call(this.opts.on, key)) {
          const element = this.opts.on[key]
          if (!element)
            continue
          this.el.addEventListener(
            `c.${this.name}.${key}`,
            e => element(e as CustomEvent<Parent>),
          )
        }
      }
    }

    this.emitEvent('init')
    if (this.accessibilityStatus.styles)
      this.el.classList.add(`c-${this.name}--a11y`)

    if (this.accessibilityStatus.attrs)
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
    this.el.classList.remove(`c-${this.name}--a11y`)
    this.destroyEvents()
  }

  /**
   * Options of the component
   */
  public get options() {
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
