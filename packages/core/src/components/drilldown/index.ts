import { tabbable } from 'tabbable'
import Parent, { type ParentOptions } from '../_parent'
import { focusChar, focusFirst, focusLast, focusSibling, generateId } from './../../utils/accessibility'

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
    this.currentEl = this.rootEl.querySelector('.c-drilldown-menu')
    if (!this.currentEl)
      throw new Error('The drilldown component needs to have an ul element : <nav class="cdrilldown"><ul class="cdrilldown__menu"></ul></nav>')

    this.wrapper = this.currentEl

    this.mutationObserver = new MutationObserver(() => {
      this.update(true)
    })
    this.resizeObserver = new ResizeObserver(() => {
      this.updateHeight()
    })

    this.resizeObserver.observe(this.rootEl)
    this.mutationObserver.observe(this.rootEl, {
      childList: true,
    })

    super.init()
    this.initAccessibilityEvents()
    this.update(true)
  }

  public initAccessibilityAttrs() {
    this.wrapper?.setAttribute('role', 'menubar')
    this.wrapper?.querySelectorAll('.c-drilldown-menu').forEach((menu) => {
      menu.setAttribute('role', 'menu')
    })

    const items = this.rootEl.querySelectorAll('.c-drilldown-menu > li')
    items.forEach((item) => {
      item.setAttribute('role', 'none')
    })

    const backs = this.rootEl.querySelectorAll('.c-drilldown-back')
    const nexts = this.rootEl.querySelectorAll('.c-drilldown-next')
    backs.forEach((back) => {
      back.setAttribute('role', 'menuitem')
    })
    nexts.forEach((next) => {
      next.setAttribute('role', 'menuitem')
      next.setAttribute('aria-expanded', 'false')
      if (!next.getAttribute('aria-controls')) {
        const menu = next.parentElement?.querySelector('.c-drilldown-menu')
        const id = menu?.id || generateId()
        next.setAttribute('aria-controls', id)
        menu?.setAttribute('id', id)
      }
    })
  }

  // Inspired by https://www.w3.org/WAI/ARIA/apg/patterns/menu/
  public initAccessibilityEvents() {
    this.rootEl.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'Up':
          // Focus to previous element
          if (this.currentEl)
            focusSibling(this.currentEl, 'previous')
          break
        case 'ArrowDown':
        case 'Down':
          // Focus to next element
          if (this.currentEl)
            focusSibling(this.currentEl, 'next')
          break
        case 'ArrowLeft':
        case 'Left':
        case 'Esc':
        case 'Escape':
          // Go to the previous element
          this.back()
          break
        case 'ArrowRight':
        case 'Right': {
          // Go to next element
          const activeElement = document.activeElement as HTMLButtonElement | null
          if (
            activeElement
            && activeElement.classList.contains('c-drilldown-next')
          )
            this.next(activeElement)
          break
        }
        case 'Home':
        case 'PageUp':
          // Moves focus to the first item in the submenu.
          if (this.currentEl)
            focusFirst(this.currentEl)
          break
        case 'End':
        case 'PageDown':
          // Moves focus to the last item in the submenu.
          if (this.currentEl)
            focusLast(this.currentEl)
          break
        default:
          // Character search
          if (this.currentEl)
            focusChar(this.currentEl, e.key)
          break
      }
    })
  }

  public initEvents() {
    const backs = this.rootEl.querySelectorAll('.c-drilldown-back')
    const nexts = this.rootEl.querySelectorAll('.c-drilldown-next')
    backs.forEach((back) => {
      back.addEventListener('click', () => this.back())
    })
    nexts.forEach((next) => {
      next.addEventListener('click', e => this.next(e))
    })
  }

  public update(reloadItems = false) {
    if (!this.wrapper)
      return

    this.wrapper.style.transform = `translateX(-${this.level * 100}%)`
    this.disableFocusElements()

    if (reloadItems) {
      this.updateItems(this.wrapper)
      this.updateHeight()
      if (this.opts.initAccessibilityAttrs === true)
        this.initAccessibilityAttrs()

      return
    }

    if (this.opts.dynamicHeight === true)
      this.updateHeight()
  }

  private updateItems(menu: HTMLUListElement, level = 0) {
    const children = menu.children

    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      const menu = child.querySelector<HTMLUListElement>('.c-drilldown-menu')
      if (!menu)
        continue
      this.updateItems(menu, level + 1)
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

    this.rootEl.style.height = `${height}px`
  }

  /**
   * Get Next or Back button with click event
   */
  private getButton(button: HTMLButtonElement | Event, type: 'back' | 'next') {
    let btn: HTMLButtonElement | null = null
    if ('target' in button) {
      const target = button.target as HTMLButtonElement
      btn = target.classList.contains(`c-drilldown-${type}`)
        ? target
        : target.closest(`.c-drilldown-${type}`)
    }
    else {
      btn = button
    }

    return btn
  }

  private disableFocusElements() {
    const elsBeenDisable = this.rootEl.querySelectorAll('[data-c-hidden]')
    elsBeenDisable.forEach((el) => {
      el.removeAttribute('data-c-hidden')
      el.removeAttribute('tabindex')
    })

    if (!this.currentEl)
      return

    const tabbables = tabbable(this.rootEl)
    tabbables.forEach((item) => {
      const menu = item.closest('.c-drilldown-menu')
      if (menu === this.currentEl)
        return

      item.setAttribute('data-c-hidden', 'true')
      item.setAttribute('tabindex', '-1')
    })
  }

  /**
   * Go to the next panel
   *
   * @param {(HTMLButtonElement | Event)} button
   */
  private next(button: HTMLButtonElement | Event) {
    const nextButton = this.getButton(button, 'next')

    if (!nextButton)
      return

    nextButton.setAttribute('aria-expanded', 'true')
    this.level++
    this.currentEl = nextButton.nextElementSibling as HTMLUListElement | null
    this.update()
    if (this.currentEl)
      focusFirst(this.currentEl)
  }

  /**
   * Back to one level
   *
   */
  private back() {
    if (!this.wrapper)
      return

    const nextsButtonExpanded = this.wrapper.querySelectorAll<HTMLElement>('.c-drilldown-next[aria-expanded="true"]')
    const nextButton = nextsButtonExpanded.length
      ? nextsButtonExpanded[nextsButtonExpanded.length - 1]
      : null

    if (!nextButton)
      return

    nextButton.setAttribute('aria-expanded', 'false')
    this.level--
    this.currentEl = nextButton.closest('.c-drilldown-menu')
    this.update()
    nextButton.focus()
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    super.destroy()
  }
}
