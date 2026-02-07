import type { ParentOptions } from './_parent'
import { tabbable } from 'tabbable'
import Parent from './_parent'

enum Events {
  Init = 'init',
  Play = 'play',
  Pause = 'pause',
  Loop = 'loop',
  Destroy = 'destroy',
}

declare global {
  interface HTMLElementEventMap extends Record<`c.marquee.${Events}`, CustomEvent<Marquee>> {}
}

type MarqueeDirection = 'left' | 'right' | 'up' | 'down'

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
  direction?: MarqueeDirection
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

export default class Marquee extends Parent<Events> {
  public readonly name = 'marquee'
  declare protected opts: MarqueeOptions

  // Constant
  private static readonly CLASS_ROOT = 'c-marquee'
  private static readonly CLASS_KEYBOARD = 'c-marquee--keyboard'
  private static readonly CLASS_PAUSE = 'c-collapse--pause'
  private static readonly CLASS_BEHAVIOR_ALTERNATE = 'c-marquee--behavior-alternate'
  private static readonly CLASS_BEHAVIOR_SCROLL = 'c-marquee--behavior-scroll'
  private static readonly CLASS_DIRECTION = 'c-marquee--direction'
  private static readonly CLASS_DIRECTION_LEFT = `${Marquee.CLASS_DIRECTION}-left`
  private static readonly CLASS_DIRECTION_RIGHT = `${Marquee.CLASS_DIRECTION}-right`
  private static readonly CLASS_DIRECTION_TOP = `${Marquee.CLASS_DIRECTION}-top`
  private static readonly CLASS_DIRECTION_BOTTOM = `${Marquee.CLASS_DIRECTION}-bottom`
  private static readonly CLASS_FILL = 'c-marquee--fill'
  private static readonly CLASS_CLONE = 'c-marquee-clone'
  private static readonly CLASS_CONTAINER = 'c-marquee-container'

  private static readonly SELECTOR_ROOT = `.${Marquee.CLASS_ROOT}`
  private static readonly SELECTOR_CONTAINER = `.${Marquee.CLASS_CONTAINER}`

  private static readonly CSSVAR_START = '--c-marquee-start'
  private static readonly CSSVAR_END = '--c-marquee-end'
  private static readonly CSSVAR_DURATION = '--c-marquee-duration'

  private containerEl: HTMLElement | null = null
  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver
  private clones: Element[] = []
  private fillMultiplier = 1

  constructor(el: HTMLElement | string, options: MarqueeOptions = {}) {
    super()
    this.opts = options
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el: HTMLElement | string, options?: MarqueeOptions): void {
    super.init(el, options)

    if (!this.el)
      return

    this.update()

    this.mutationObserver = this.opts.mutationObserver === false
      ? undefined
      : new MutationObserver(([el]) => {
          const addedEls = Array.from(el.addedNodes) as HTMLElement[]
          const isFilling = addedEls.findIndex(item => item.classList.contains(Marquee.CLASS_CLONE)) === -1
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

  protected initElements(): void {
    this.containerEl = this.el?.querySelector(Marquee.SELECTOR_CONTAINER) || null
  }

  public initAccessibilityAttrs(): void {
    this.el?.setAttribute('tabindex', '0')
  }

  protected initEvents(): void {
    if (!this.el)
      return

    this.registerEvent({
      id: 'registerLoopEvent',
      function: () => {
        this.emitEvent('loop')
      },
      event: 'animationiteration',
      el: this.el,
    })

    this.initAccessibilityEvents()
  }

  /**
   * Init accessibility events.
   */
  private initAccessibilityEvents(): void {
    if (!this.el)
      return

    this.registerEvent({
      id: 'addKeyboardClass',
      function: () => {
        if (!this.el)
          return
        this.el.classList.add(Marquee.CLASS_KEYBOARD)
      },
      event: 'keydown',
      el: this.el,
    })

    this.registerEvent({
      id: 'removeKeyboardClass',
      function: (e: FocusEvent) => {
        if (!this.el)
          return

        const target = e.target as Element | null
        if (
          target && (
            target.classList.contains(Marquee.CLASS_ROOT)
            || target.closest(Marquee.SELECTOR_ROOT)
          )
        ) {
          return
        }
        this.el.classList.remove(Marquee.CLASS_KEYBOARD)
      },
      event: 'focusout',
      el: this.el,
    })
  }

  private get elSize(): number {
    if (!this.el)
      return 0
    return this.opts.direction === 'up' || this.opts.direction === 'down' ? this.el.clientHeight : this.el.clientWidth
  }

  private get containerSize(): number {
    if (!this.containerEl)
      return 0
    return this.opts.direction === 'up' || this.opts.direction === 'down' ? this.containerEl.clientHeight / (this.fillMultiplier + 1) : this.containerEl.clientWidth / (this.fillMultiplier + 1)
  }

  /**
   * Update the marquee
   */
  public update(forceFillRegeneration = false): void {
    if (!this.el)
      return

    if (!this.containerEl)
      return
    const currentDirection = this.opts.direction || 'right'
    const directions: MarqueeDirection[] = ['left', 'right', 'up', 'down']
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
      Marquee.CSSVAR_DURATION,
      duration,
    )

    // Fill
    this.el.classList.toggle(
      Marquee.CLASS_FILL,
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
      Marquee.CLASS_BEHAVIOR_ALTERNATE,
      this.opts?.behavior === 'alternate',
    )
    this.el.classList.toggle(
      Marquee.CLASS_BEHAVIOR_SCROLL,
      this.opts?.behavior !== 'alternate',
    )

    // Directions
    this.el.classList.add(`${Marquee.CLASS_DIRECTION}-${currentDirection}`)
    for (let index = 0; index < directions.length; index++) {
      const direction = directions[index]
      if (currentDirection !== direction)
        this.el.classList.remove(`${Marquee.CLASS_DIRECTION}-${direction}`)
    }

    if (this.opts.fill) {
      this.el.style.setProperty(
        Marquee.CSSVAR_START,
        `0`,
      )
      this.el.style.setProperty(
        Marquee.CSSVAR_END,
        `-${Math.ceil(this.containerSize)}px`,
      )
    }
    else {
      this.el.style.setProperty(
        Marquee.CSSVAR_END,
        `${Math.ceil(this.elSize)}px`,
      )
    }
  }

  public play(): void {
    this.el?.classList.remove(Marquee.CLASS_PAUSE)
    this.emitEvent('play')
  }

  public pause(): void {
    this.el?.classList.add(Marquee.CLASS_PAUSE)
    this.emitEvent('pause')
  }

  public get isPaused(): boolean {
    return this.el?.classList.contains(Marquee.CLASS_PAUSE) || true
  }

  private fill(fillMultiplier: number): void {
    if (!this.containerEl)
      return

    this.clones.forEach(clone => clone.remove())

    const items = Array.from(this.containerEl.children)
    this.clones = []
    for (let index = 0; index < fillMultiplier; index++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true) as Element
        clone.classList.add(Marquee.CLASS_CLONE)
        clone.setAttribute('aria-hidden', 'true')

        this.clones.push(clone)
        this.containerEl?.append(clone)

        const tabbables = tabbable(clone)
        tabbables.forEach(item => item.setAttribute('tabindex', '-1'))
      })
    }
  }

  public destroy(): void {
    if (!this.el)
      return
    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    this.clones.forEach(clone => clone.remove())
    this.el.removeAttribute('tabindex')

    this.el.classList.remove(
      Marquee.CLASS_PAUSE,
      Marquee.CLASS_KEYBOARD,
      Marquee.CLASS_BEHAVIOR_ALTERNATE,
      Marquee.CLASS_BEHAVIOR_SCROLL,
      Marquee.CLASS_DIRECTION_BOTTOM,
      Marquee.CLASS_DIRECTION_LEFT,
      Marquee.CLASS_DIRECTION_RIGHT,
      Marquee.CLASS_DIRECTION_TOP,
      Marquee.CLASS_FILL,
    )

    this.el.style.removeProperty(Marquee.CSSVAR_START)
    this.el.style.removeProperty(Marquee.CSSVAR_END)
    this.el.style.removeProperty(Marquee.CSSVAR_DURATION)

    super.destroy()
  }
}
