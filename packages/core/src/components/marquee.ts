import Parent, { type ParentOptions } from './_parent'

declare global {
  interface HTMLElementEventMap {
    'c.marquee.init': CustomEvent<Marquee>
    'c.marquee.destroy': CustomEvent<Marquee>
    'c.marquee.play': CustomEvent<Marquee>
    'c.marquee.pause': CustomEvent<Marquee>
    'c.marquee.loop': CustomEvent<Marquee>
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
   * Set the duration of the marquee animation.
   * Accept multiplier calculation via a number or animation-duration value via string.
   * @default 1
   */
  duration?: number | string
}

export default class Marquee extends Parent {
  declare public opts: MarqueeOptions
  private containerEl: HTMLElement | null = null
  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver
  private clones: Element[] = []
  private fillMultiplier = 1

  constructor(el: HTMLElement | string, options: MarqueeOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'marquee'
    super.init()
    this.update()
    this.containerEl = this.el.querySelector('.c-marquee-container')

    this.mutationObserver = new MutationObserver(([el]) => {
      const addedEls = Array.from(el.addedNodes) as HTMLElement[]
      const isFilling = addedEls.findIndex(item => item.classList.contains('c-marquee-clone')) === -1
      if (!isFilling)
        this.update(this.opts.fill)
    })
    this.resizeObserver = new ResizeObserver(() => {
      // fix wrong calculation from Firefox
      setTimeout(() => this.update(), 1)
    })

    this.resizeObserver.observe(this.el)
    this.mutationObserver.observe(this.el, {
      childList: true,
      subtree: true,
    })
  }

  public initAccessibilityAttrs() {}

  public initEvents() {
    this.destroyEvents()

    this.registerEvent({
      id: 'registerLoopEvent',
      function: () => {
        this.emitEvent('loop')
      },
      event: 'animationiteration',
      el: this.el,
    })

    this.registerEvent({
      id: 'addKeyboardClass',
      function: () => {
        this.el.classList.add('c-marquee--keyboard')
      },
      event: 'keydown',
      el: this.el,
    })

    this.registerEvent({
      id: 'removeKeyboardClass',
      function: () => {
        if (document.activeElement && document.activeElement.closest('.c-marquee'))
          return
        this.el.classList.remove('c-marquee--keyboard')
      },
      event: 'blur',
      el: this.el,
    })
  }

  private get elSize() {
    return this.opts.direction === 'up' || this.opts.direction === 'down' ? this.el.clientHeight : this.el.clientWidth
  }

  private get containerSize() {
    if (!this.containerEl)
      return 0
    return this.opts.direction === 'up' || this.opts.direction === 'down' ? this.containerEl.clientHeight / (this.fillMultiplier + 1) : this.containerEl.clientWidth / (this.fillMultiplier + 1)
  }

  /**
   * Update the marquee
   */
  public update(forceFillRegeneration = false) {
    if (!this.containerEl)
      return
    const currentDirection = this.opts.direction || 'right'
    const directions = ['left', 'right', 'top', 'bottom']
    const currentFillMultiplier = this.opts.fill ? Math.ceil(this.elSize / this.containerSize) : 1

    // Duration
    let duration: string
    if (typeof this.opts.duration === 'string') {
      duration = this.opts.duration
    }
    else {
      const multiplierSpeed = this.opts.fill ? this.containerSize / this.elSize * 0.05 : 0.05
      const multiplier = (this.opts.duration || 1) * multiplierSpeed * Math.max(this.containerSize, this.elSize)

      duration = `${multiplier.toFixed(2)}s`
    }

    this.el.style.setProperty(
      '--c-marquee-duration',
      duration,
    )

    // Fill
    this.el.classList.toggle(
      'c-marquee--fill',
      this.opts?.fill === true,
    )

    if (
      this.opts.fill && (
        (currentFillMultiplier && this.fillMultiplier !== currentFillMultiplier) || forceFillRegeneration)
    ) {
      this.fill(currentFillMultiplier)
      this.fillMultiplier = currentFillMultiplier
    }

    // Behavior
    this.el.classList.toggle(
      'c-marquee--behavior-alternate',
      this.opts?.behavior === 'alternate',
    )
    this.el.classList.toggle(
      'c-marquee--behavior-scroll',
      this.opts?.behavior !== 'alternate',
    )

    // Directions
    this.el.classList.add(`c-marquee--direction-${currentDirection}`)
    directions.forEach((direction) => {
      if (currentDirection !== direction)
        this.el.classList.remove(`c-marquee--direction-${direction}`)
    })

    if (this.opts.fill) {
      this.el.style.setProperty(
        '--c-marquee-start',
        `0`,
      )
      this.el.style.setProperty(
        '--c-marquee-end',
        `-${Math.ceil(this.containerSize)}px`,
      )
    }
    else {
      this.el.style.setProperty(
        '--c-marquee-end',
        `${Math.ceil(this.elSize)}px`,
      )
    }
  }

  public play() {
    this.el.classList.remove('c-marquee--pause')
    this.emitEvent('play')
  }

  public pause() {
    this.el.classList.add('c-marquee--pause')
    this.emitEvent('pause')
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    super.destroy()
  }

  private fill(fillMultiplier: number) {
    if (!this.containerEl)
      return

    this.clones.forEach(clone => clone.remove())

    const items = Array.from(this.containerEl.children)
    this.clones = []
    for (let index = 0; index < fillMultiplier; index++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true) as Element
        clone.classList.add('c-marquee-clone')
        clone.setAttribute('aria-hidden', 'true')
        this.clones.push(clone)
        this.containerEl?.append(clone)
      })
    }
  }
}
