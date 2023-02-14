import Parent, { type ParentOptions } from '../_parent'

export interface DrilldownOptions extends ParentOptions {
  dynamicHeight?: boolean
}

interface DrilldownTree {
  el: HTMLUListElement
  children: DrilldownTree[]
}

export default class Drilldown extends Parent {
  declare public opts: DrilldownOptions
  private currentEl: HTMLUListElement | null = null
  private wrapper: HTMLUListElement | null = null
  private height = 0
  private tree?: DrilldownTree

  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver

  constructor(el: HTMLElement | string, options: DrilldownOptions = {}) {
    super(el, options)
  }

  public init() {
    this.currentEl = this.el.querySelector('.c-drilldown__menu')
    if (!this.currentEl)
      throw new Error('The drilldown component needs to have an ul element : <nav class="cdrilldown"><ul class="cdrilldown__menu"></ul></nav>')

    this.wrapper = this.currentEl

    this.mutationObserver = new MutationObserver(() => {
      this.update()
    })
    this.resizeObserver = new ResizeObserver(() => {
      this.updateHeight()
    })

    this.resizeObserver.observe(this.el)
    this.mutationObserver.observe(this.el, {
      childList: true,
    })

    super.init()
  }

  protected initAccessibilityAttrs() {
    this.wrapper?.setAttribute('role', 'menubar')
    this.wrapper?.querySelectorAll('.c-drilldown__menu').forEach((menu) => {
      menu.setAttribute('role', 'menu')
    })

    const items = this.el.querySelectorAll('.c-drilldown__menu > li')
    items.forEach((item) => {
      item.setAttribute('role', 'none')
    })

    const backs = this.el.querySelectorAll('.c-drilldown__back')
    const nexts = this.el.querySelectorAll('.c-drilldown__next')
    backs.forEach((item) => {
      item.setAttribute('role', 'menuitem')
    })
    nexts.forEach((item) => {
      item.setAttribute('role', 'menuitem')
      item.setAttribute('aria-expanded', 'false')
    })
  }

  public update() {
    if (this.opts.dynamicHeight === true)
      this.updateHeight()
  }

  private updateHeight() {
    let height = 0

    if (this.opts.dynamicHeight === true && this.currentEl) {
      height = this.currentEl.clientHeight
    }
    else if (this.tree) {
      const menus = this.tree.el.getElementsByClassName('c-drilldown__menu')
      height = this.tree.el.clientHeight
      for (let index = 0; index < menus.length; index++) {
        const element = menus[index]
        if (element.clientHeight > height)
          height = element.clientHeight
      }
      this.height = height
    }

    this.height = height
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    super.destroy()
  }
}
