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

export default abstract class Parent {
  protected el: HTMLElement
  public opts: ParentOptions

  constructor(el: HTMLElement | string, options: ParentOptions) {
    const checkEl = typeof el === 'string' ? document.querySelector<HTMLElement>(el) : el
    if (!checkEl)
      throw new Error('The element/selector provided cannot be found')

    this.el = checkEl

    this.opts = options
    if (typeof options.init === 'undefined' || options.init === true)
      this.init()
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
   * Destroy the component
   */
  protected destroy(): void {
    this.emitEvent('destroy')
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
