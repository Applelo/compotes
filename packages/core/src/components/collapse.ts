import Parent, { type ParentOptions } from './_parent'

export default class Collapse extends Parent {
  private triggers: HTMLElement[] = []
  private expanded = false
  private collapsing = false
  private timeout: number | undefined = undefined
  constructor(el: HTMLElement | string, options: ParentOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'collapse'
    this.expanded = this.el.classList.contains('c-collapse--show')
    this.update()
    super.init()
  }

  protected initAccessibilityAttrs(): void {
    this.triggers.forEach((trigger) => {
      if (trigger.tagName !== 'BUTTON')
        trigger.setAttribute('role', 'button')
    })
  }

  protected initEvents(): void {
    this.destroyEvents(['toggle'])
    this.triggers.forEach((item) => {
      this.registerEvent({
        id: 'toggle',
        function: this.toggle.bind(this),
        event: 'click',
        el: item,
      })
    })
  }

  public update() {
    this.triggers = Array.from(
      document.querySelectorAll<HTMLElement>(`.c-collapse-trigger[aria-controls="${this.el.id}"]`),
    )
    this.triggers.forEach((trigger) => {
      trigger.setAttribute(
        'aria-expanded',
        this.expanded ? 'true' : 'false',
      )
    })
  }

  public toggle() {
    this.expanded ? this.hide() : this.show()
  }

  public show() {
    this.expanded = true
    if (this.hasTransition) {
      this.collapsing = true
      this.el.classList.add('c-collapse--collapsing')
      const height = this.el.scrollHeight
      this.el.style.height = `${height}px`
      this.onCollapse()
    }
    this.el.classList.add('c-collapse--show')
    this.update()
  }

  public hide() {
    this.expanded = false
    if (this.hasTransition) {
      const height = this.el.scrollHeight
      this.el.style.height = `${height}px`
      // eslint-disable-next-line no-unused-expressions
      this.el.offsetHeight // reflow
      this.collapsing = true
      this.el.classList.add('c-collapse--collapsing')
      this.el.style.height = '0px'
      this.onCollapse()
    }
    this.el.classList.remove('c-collapse--show')

    this.update()
  }

  private onCollapse() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.el.classList.remove('c-collapse--collapsing')
      this.collapsing = false
      this.el.style.height = ''
    }, this.transitionDuration)
  }

  public get isExpanded() {
    return this.expanded
  }

  public get isCollapsing() {
    return this.collapsing
  }

  private get hasTransition() {
    return this.transitionDuration === 0
  }

  /**
   * From bootstrap
   * @see https://github.com/twbs/bootstrap/blob/main/js/src/util/index.js
   */
  private get transitionDuration() {
    let { transitionDuration, transitionDelay } = window.getComputedStyle(this.el)

    const floatTransitionDuration = Number.parseFloat(transitionDuration)
    const floatTransitionDelay = Number.parseFloat(transitionDelay)

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay)
      return 0

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0]
    transitionDelay = transitionDelay.split(',')[0]

    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * 1000
  }
}
