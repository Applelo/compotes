import Parent, { type ParentOptions } from './_parent'

declare global {
  interface HTMLElementEventMap {
    'c.marquee.init': CustomEvent<Marquee>
    'c.marquee.destroy': CustomEvent<Marquee>
  }
}

export interface MarqueeOptions extends ParentOptions {
  fill?: boolean
}

export default class Marquee extends Parent {
  constructor(el: HTMLElement | string, options: MarqueeOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'marquee'
    super.init()
  }

  public initAccessibilityAttrs() {}

  public initEvents() {
    this.destroyEvents()
  }
}
