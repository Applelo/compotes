import ErrorCompotes from '../utils/error'

export enum Events {
  Init = 'init',
  Destroy = 'destroy',
}

export interface ParentOptions<E extends string> {
  /**
   * Init the component on creation.
   * @default true
   */
  init?: boolean
  /**
   * An object to instantiate events listeners
   * @default undefined
   */
  on?: Partial<Record<E, (e: CustomEvent<Parent>) => void | undefined>>
}

interface ParentEvent {
  id: string
  event: keyof HTMLElementEventMap
  function: any
  el: Element | Window
}

export default abstract class Parent<E extends string = Events> {
  protected abstract name: string

  public el: HTMLElement | null = null
  protected opts: ParentOptions<E> = {}
  private eventsController: AbortController | null = null

  /**
   * Init the component
   */
  public init(el?: HTMLElement | string, options: ParentOptions<E> = {}) {
    const checkEl = typeof el === 'string'
      ? document.querySelector<HTMLElement>(el)
      : el

    if (!checkEl)
      throw this.error('The element/selector provided cannot be found.')

    this.el = checkEl
    this.opts = options

    if (this.opts.on) {
      for (const key in this.opts.on) {
        if (Object.prototype.hasOwnProperty.call(this.opts.on, key)) {
          const element = this.opts.on[key]
          if (!element)
            continue
          this.el?.addEventListener(
            `c.${this.name}.${key}`,
            e => element(e as CustomEvent<Parent>),
          )
        }
      }
    }

    this.eventsController = new AbortController()
    this.emitEvent(Events.Init)
    if (this.initElements)
      this.initElements()
    this.initEvents()
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
    return this.el?.dispatchEvent(event)
  }

  /**
   * Init elements on the component
   */
  protected initElements?(): void

  /**
   * Init events on the component
   */
  protected abstract initEvents(): void

  /**
   * Register an event
   */
  protected registerEvent(e: ParentEvent) {
    if (!this.eventsController)
      return

    e.el.addEventListener(
      e.event,
      e.function,
      {
        signal: this.eventsController.signal,
      },
    )
  }

  /**
   * Destroy the component
   */
  public destroy() {
    this.eventsController?.abort()
    this.emitEvent(Events.Destroy)
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

  protected get isInitializable() {
    return typeof this.opts.init === 'undefined' || this.opts.init === true
  }
}
