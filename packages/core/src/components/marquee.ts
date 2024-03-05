import { tabbable } from 'tabbable'
import Parent, { type ParentOptions } from './_parent'

type Events = 'init' | 'play' | 'pause' | 'loop' | 'destroy'

declare global {
  interface HTMLElementEventMap extends Record<`c.marquee.${Events}`, CustomEvent<Marquee>> {}
}

export interface MarqueeOptions extends ParentOptions<Events> {
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
  /**
   * Use MutationObserver to update component on changes
   * @default true
   */
  mutationObserver?: boolean
}

export default class Marquee extends Parent {
  declare public opts: MarqueeOptions
  private containerEl: HTMLElement | null = null
  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver
  private clones: Element[] = []
  private fillMultiplier = 1

  private keyboardClass = 'c-marquee--keyboard'
  private pauseClass = 'c-marquee--pause'
  private behaviorAlternateClass = 'c-marquee--behavior-alternate'
  private behaviorScrollClass = 'c-marquee--behavior-scroll'
  private directionLeftClass = 'c-marquee--direction-left'
  private directionRightClass = 'c-marquee--direction-right'
  private directionTopClass = 'c-marquee--direction-top'
  private directionBottomClass = 'c-marquee--direction-bottom'
  private fillClass = 'c-marquee--fill'
  private startCssVar = '--c-marquee-start'
  private endCssVar = '--c-marquee-end'
  private durationCssVar = '--c-marquee-duration'

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

    this.mutationObserver = this.opts.mutationObserver === false
      ? undefined
      : new MutationObserver(([el]) => {
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
    this.mutationObserver?.observe(this.el, {
      childList: true,
      subtree: true,
    })
  }

  public initAccessibilityAttrs() {
    this.el.setAttribute('tabindex', '0')
  }

  public initEvents() {
    this.destroyEvents(['registerLoopEvent'])

    this.registerEvent({
      id: 'registerLoopEvent',
      function: () => {
        this.emitEvent('loop')
      },
      event: 'animationiteration',
      el: this.el,
    })

    if (this.accessibilityStatus.events)
      this.initAccessibilityEvents()
  }

  /**
   * Init accessibility events.
   */
  public initAccessibilityEvents() {
    this.destroyEvents(['addKeyboardClass', 'removeKeyboardClass'])
    this.registerEvent({
      id: 'addKeyboardClass',
      function: () => {
        this.el.classList.add(this.keyboardClass)
      },
      event: 'keydown',
      el: this.el,
    })

    this.registerEvent({
      id: 'removeKeyboardClass',
      function: (e: FocusEvent) => {
        const target = e.target as Element | null
        if (
          target && (
            target.classList.contains('.c-marquee')
            || target.closest('.c-marquee')
          )
        )
          return
        this.el.classList.remove(this.keyboardClass)
      },
      event: 'focusout',
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
      this.durationCssVar,
      duration,
    )

    // Fill
    this.el.classList.toggle(
      this.fillClass,
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
      this.behaviorAlternateClass,
      this.opts?.behavior === 'alternate',
    )
    this.el.classList.toggle(
      this.behaviorScrollClass,
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
        this.startCssVar,
        `0`,
      )
      this.el.style.setProperty(
        this.endCssVar,
        `-${Math.ceil(this.containerSize)}px`,
      )
    }
    else {
      this.el.style.setProperty(
        this.endCssVar,
        `${Math.ceil(this.elSize)}px`,
      )
    }
  }

  public play() {
    this.el.classList.remove(this.pauseClass)
    this.emitEvent('play')
  }

  public pause() {
    this.el.classList.add(this.pauseClass)
    this.emitEvent('pause')
  }

  public get isPaused() {
    return this.el.classList.contains(this.pauseClass)
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

        if (this.accessibilityStatus.attrs)
          clone.setAttribute('aria-hidden', 'true')

        this.clones.push(clone)
        this.containerEl?.append(clone)

        if (this.accessibilityStatus.attrs) {
          const tabbables = tabbable(clone)
          tabbables.forEach(item => item.setAttribute('tabindex', '-1'))
        }
      })
    }
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    this.clones.forEach(clone => clone.remove())
    this.el.removeAttribute('tabindex')
    this.el.classList.remove(this.pauseClass)
    this.el.classList.remove(this.keyboardClass)
    this.el.classList.remove(this.behaviorAlternateClass)
    this.el.classList.remove(this.behaviorScrollClass)
    this.el.classList.remove(this.directionLeftClass)
    this.el.classList.remove(this.directionRightClass)
    this.el.classList.remove(this.directionTopClass)
    this.el.classList.remove(this.directionBottomClass)
    this.el.classList.remove(this.fillClass)
    this.el.style.removeProperty(this.startCssVar)
    this.el.style.removeProperty(this.endCssVar)
    this.el.style.removeProperty(this.durationCssVar)
    super.destroy()
  }
}
