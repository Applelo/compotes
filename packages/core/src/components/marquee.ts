import Parent, { type ParentOptions } from './_parent'

declare global {
  interface HTMLElementEventMap {
    'c.marquee.init': CustomEvent<Marquee>
    'c.marquee.destroy': CustomEvent<Marquee>
  }
}

export interface MarqueeOptions extends ParentOptions {
  /**
   * Clone elements to fill the Marquee. Useful for infinite loop
   * @default false
   */
  fill?: boolean
  /**
   * Direction of the marquee
   * @default 'right'
   */
  direction?: 'left' | 'right' | 'up' | 'down'
  /**
   * Behavior of the marquee animation
   * @default 'scroll'
   */
  behavior?: 'scroll' | 'alternate'
  /**
   * Loop the marquee
   * @default true
   */
  loop?: boolean
  /**
   * Set the duration of the marquee animation.
   * Accept multiplier calculation via a number or animation-duration value via string.
   * @default 1
   */
  duration?: number | string
}

export default class Marquee extends Parent {
  declare public opts: MarqueeOptions
  private resizeObserver?: ResizeObserver

  constructor(el: HTMLElement | string, options: MarqueeOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'marquee'
    super.init()
    this.update()

    this.resizeObserver = new ResizeObserver(() => {
      this.update()
    })
    this.resizeObserver.observe(this.el)
  }

  public initAccessibilityAttrs() {}

  public initEvents() {
    this.destroyEvents()
  }

  /**
   * Update the marquee
   */
  public update() {
    const currentDirection = this.opts.direction || 'right'
    const directions = ['left', 'right', 'top', 'bottom']

    // Behavior
    this.el.classList.toggle('c-marquee--behavior-alternate', this.opts?.behavior === 'alternate')
    this.el.classList.toggle('c-marquee--behavior-scroll', this.opts?.behavior !== 'alternate')

    // Directions
    this.el.classList.add(`c-marquee--direction-${currentDirection}`)
    directions.forEach((direction) => {
      if (currentDirection !== direction)
        this.el.classList.remove(`c-marquee--direction-${direction}`)
    })

    if (this.opts.direction === 'up' || this.opts.direction === 'down') {
      this.el.style.setProperty(
        '--c-marquee-end',
        `${this.el.clientHeight}px`,
      )
    }
    else {
      this.el.style.setProperty(
        '--c-marquee-end',
        `${Math.ceil(this.el.clientWidth)}px`,
      )
    }
  }

  public destroy() {
    this.resizeObserver?.disconnect()
    super.destroy()
  }
}
