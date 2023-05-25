import Parent, { type ParentOptions } from '../_parent'

export interface DrilldownOptions extends ParentOptions {
  dynamicHeight?: boolean
}

interface DrilldownItem {
  el: HTMLUListElement
  level: number
}

export default class Drilldown extends Parent {
  declare public opts: DrilldownOptions
  private currentEl: HTMLUListElement | null = null
  private wrapper: HTMLUListElement | null = null
  private items: DrilldownItem[] = []
  private level = 0

  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver

  constructor(el: HTMLElement | string, options: DrilldownOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.currentEl = this.el.querySelector('.c-drilldown-menu')
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
    this.update()
    this.updateHeight()
  }

  protected initAccessibilityAttrs() {
    this.wrapper?.setAttribute('role', 'menubar')
    this.wrapper?.querySelectorAll('.c-drilldown-menu').forEach((menu) => {
      menu.setAttribute('role', 'menu')
    })

    const items = this.el.querySelectorAll('.c-drilldown-menu > li')
    items.forEach((item) => {
      item.setAttribute('role', 'none')
    })

    const backs = this.el.querySelectorAll('.c-drilldown-back')
    const nexts = this.el.querySelectorAll('.c-drilldown-next')
    backs.forEach((item) => {
      item.setAttribute('role', 'menuitem')
    })
    nexts.forEach((item) => {
      item.setAttribute('role', 'menuitem')
      item.setAttribute('aria-expanded', 'false')
    })
  }

  public update() {
    if (!this.wrapper)
      return

    this.setItems(this.wrapper)

    if (this.opts.dynamicHeight === true)
      this.updateHeight()
    if (this.opts.initAccessibilityAttrs === true)
      this.initAccessibilityAttrs()
  }

  private setItems(menu: HTMLUListElement, level = 0) {
    const children = menu.children

    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      const menu = child.querySelector<HTMLUListElement>('.c-drilldown-menu')
      if (!menu)
        continue
      this.setItems(menu, level + 1)
    }

    this.items.push({
      el: menu,
      level,
    })
  }

  private updateHeight() {
    let height = 0

    if (this.opts.dynamicHeight === true && this.currentEl) {
      height = this.currentEl.clientHeight
    }
    else {
      for (let index = 0; index < this.items.length; index++) {
        const item = this.items[index]
        if (item.el.clientHeight > height)
          height = item.el.clientHeight
      }
    }

    this.el.style.height = `${height}px`
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    super.destroy()
  }
}
