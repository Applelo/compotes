import ErrorCompotes from '../utils/error'

export enum Events {
  Init = 'init',
  Destroy = 'destroy',
}

/**
 * Callback function for state changes
 */
export type StateChangeCallback<T = any> = (state: T) => void

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
  on?: Partial<Record<E, (e: CustomEvent<Parent<E>>) => void | undefined>>
  /**
   * Callback function invoked when component state changes
   * @default undefined
   */
  onStateChange?: StateChangeCallback
}

interface ParentEvent {
  id: string
  event: keyof HTMLElementEventMap
  function: any
  el: Element | Window
}

export default abstract class Parent<
  E extends string = Events,
  O extends ParentOptions<E> = ParentOptions<E>,
> {
  protected abstract readonly name: string

  public el: HTMLElement | null = null
  protected opts: O = {} as O
  private eventsController: AbortController | null = null
  private stateChangeCallback: StateChangeCallback | null = null

  /**
   * Init the component
   */
  public init(el?: HTMLElement | string, options?: O): void {
    if (!el && !this.el)
      return

    if (!this.el) {
      const checkEl = typeof el === 'string'
        ? document.querySelector<HTMLElement>(el)
        : el

      if (!checkEl)
        throw this.error('The element/selector provided cannot be found.')

      this.el = checkEl
    }

    this.opts = options ?? this.opts ?? ({} as O)

    this.stateChangeCallback = this.opts.onStateChange ?? null

    this.eventsController = new AbortController()

    if (this.opts.on) {
      for (const key in this.opts.on) {
        if (Object.prototype.hasOwnProperty.call(this.opts.on, key)) {
          const element = this.opts.on[key]
          if (!element)
            continue
          this.el?.addEventListener(
            `c.${this.name}.${key}`,
            e => element(e as CustomEvent<Parent<E>>),
            { signal: this.eventsController.signal },
          )
        }
      }
    }
    this.emitEvent(Events.Init)
    if (this.initElements)
      this.initElements()
    this.initEvents()
  }

  /**
   * Emit an event
   */
  protected emitEvent(name: string, cancelable = false): boolean | undefined {
    const event = new CustomEvent<this>(
      `c.${this.name}.${name}`,
      {
        detail: this,
        cancelable,
      },
    )
    const result = this.el?.dispatchEvent(event)
    this.notifyStateChange()
    return result
  }

  /**
   * Get the current state of the component
   */
  protected abstract getState(): any

  /**
   * Notify state change callback if registered
   */
  protected notifyStateChange(): void {
    if (this.stateChangeCallback) {
      this.stateChangeCallback(this.getState())
    }
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
  protected registerEvent(e: ParentEvent): void {
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
  public destroy(): void {
    this.stateChangeCallback = null
    this.emitEvent(Events.Destroy)
    this.eventsController?.abort()
  }

  /**
   * Options of the component
   */
  public get options(): O {
    return this.opts
  }

  /**
   * Generate an error message
   * Can be use with `throw` or directly inside `console.error(`)`
   */
  protected error(msg: string, params?: ErrorOptions): ErrorCompotes {
    return new ErrorCompotes(msg, params, this.name)
  }

  protected get isInitializable(): boolean {
    return typeof this.opts.init === 'undefined' || this.opts.init === true
  }
}
