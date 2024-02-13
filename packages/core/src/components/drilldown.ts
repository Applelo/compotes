import { tabbable } from 'tabbable'
import { focusChar, focusFirst, focusLast, focusSibling, generateId } from '../utils/accessibility'
import Parent, { type ParentOptions } from './_parent'
import { getTransitionDuration } from './../utils/animation'

declare global {
  interface HTMLElementEventMap {
    'c.drilldown.init': CustomEvent<Drilldown>
    'c.drilldown.destroy': CustomEvent<Drilldown>
    'c.drilldown.update': CustomEvent<Drilldown>
    'c.drilldown.next': CustomEvent<Drilldown>
    'c.drilldown.back': CustomEvent<Drilldown>
    'c.drilldown.reset': CustomEvent<Drilldown>
  }
}

export interface DrilldownOptions extends ParentOptions {
  /**
   * Adjust height dynamically with the current menu height
   * @default false
   */
  dynamicHeight?: boolean
  /**
   * Use MutationObserver to update component on changes
   * @default true
   */
  mutationObserver?: boolean
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

  private delayCssVar = '--c-drilldown-delay'
  private hiddenData = 'data-c-hidden'

  constructor(el: HTMLElement | string, options: DrilldownOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'drilldown'
    this.currentEl = this.el.querySelector('.c-drilldown-menu')
    if (!this.currentEl) {
      throw this.error(
        'The component needs to have an ul element : <nav class="c-drilldown"><ul class="c-drilldown-menu"></ul></nav>',
        { cause: this.el },
      )
    }

    this.wrapper = this.currentEl

    this.mutationObserver = this.opts.mutationObserver === false
      ? undefined
      : new MutationObserver(() => {
        this.update(true)
      })
    this.resizeObserver = new ResizeObserver(() => {
      this.updateHeight()
    })

    this.resizeObserver.observe(this.el)
    this.mutationObserver?.observe(this.el, {
      childList: true,
      subtree: true,
    })

    super.init()
    this.update(true)
  }

  public initAccessibilityAttrs() {
    this.wrapper?.setAttribute('role', 'menubar')
    this.wrapper?.setAttribute('aria-multiselectable', 'false')
    this.wrapper?.setAttribute('aria-orientation', 'vertical')
    this.wrapper?.querySelectorAll('.c-drilldown-menu').forEach((menu) => {
      menu.setAttribute('role', 'menu')
    })

    const items = this.el.querySelectorAll('.c-drilldown-menu > li')
    items.forEach((item) => {
      item.setAttribute('role', 'none')
    })

    const backs = this.el.querySelectorAll('.c-drilldown-back')
    const nexts = this.el.querySelectorAll('.c-drilldown-next')
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

  public initEvents() {
    const backs = this.el.querySelectorAll('.c-drilldown-back')
    const nexts = this.el.querySelectorAll('.c-drilldown-next')
    this.destroyEvents(['back', 'next'])
    backs.forEach((back) => {
      this.registerEvent({
        id: 'back',
        el: back,
        event: 'click',
        function: this.back.bind(this),
      })
    })
    nexts.forEach((next) => {
      this.registerEvent({
        id: 'next',
        el: next,
        event: 'click',
        function: this.next.bind(this),
      })
    })

    if (this.accessibilityStatus.events)
      this.initAccessibilityEvents()
  }

  /**
   * Init accessibility events.
   * Inspired by https://www.w3.org/WAI/ARIA/apg/patterns/menu/ controls
   */
  public initAccessibilityEvents() {
    this.destroyEvents(['key'])
    this.registerEvent({
      id: 'key',
      event: 'keydown',
      el: this.el,
      function: (e: KeyboardEvent) => {
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
              focusFirst(this.currentEl, this.el)
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
      },
    })
  }

  /**
   * Update the drilldown component
   */
  public update(reloadItems = false) {
    if (!this.wrapper)
      return

    this.wrapper.style.transform = `translateX(-${this.level * 100}%)`
    const delay = getTransitionDuration(this.wrapper)
    this.wrapper.style.setProperty(this.delayCssVar, `${delay}ms`)
    this.disableFocusElements()

    if (reloadItems) {
      this.updateItems(this.wrapper)
      this.updateHeight()
      if (this.accessibilityStatus.attrs === true)
        this.initAccessibilityAttrs()

      return
    }

    if (this.opts.dynamicHeight === true)
      this.updateHeight()

    this.emitEvent('update')
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

    this.el.style.height = `${height}px`
  }

  /**
   * Get Next or Back button with click event
   */
  private getButton(button: HTMLButtonElement | Event, type: 'back' | 'next') {
    let btn: HTMLButtonElement | null = null
    if ('target' in button) {
      const target = button.target as HTMLButtonElement | null
      if (target) {
        btn = target.classList.contains(`c-drilldown-${type}`)
          ? target
          : target.closest(`.c-drilldown-${type}`)
      }
      else {
        btn = null
      }
    }
    else {
      btn = button
    }

    return btn
  }

  private disableFocusElements() {
    const elsBeenDisable = this.el.querySelectorAll('[data-c-hidden]')
    elsBeenDisable.forEach((el) => {
      el.removeAttribute(this.hiddenData)
      el.removeAttribute('tabindex')
    })

    if (!this.currentEl)
      return

    const tabbables = tabbable(this.el)
    tabbables.forEach((item) => {
      const menu = item.closest('.c-drilldown-menu')
      if (menu === this.currentEl)
        return

      item.setAttribute(this.hiddenData, 'true')
      item.setAttribute('tabindex', '-1')
    })
  }

  /**
   * Go to the next panel
   *
   * @param {(HTMLButtonElement | Event)} button
   */
  private next(button: HTMLButtonElement | MouseEvent) {
    const nextButton = this.getButton(button, 'next')

    if (!nextButton)
      return

    nextButton.setAttribute('aria-expanded', 'true')
    this.level++
    this.currentEl = nextButton.parentElement?.querySelector('.c-drilldown-menu') as HTMLUListElement | null
    this.update()
    if (this.currentEl)
      focusFirst(this.currentEl, this.el)
    this.emitEvent('next')
  }

  /**
   * Back to one level
   */
  public back() {
    if (!this.wrapper || this.level === 0)
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
    if (this.currentEl)
      focusFirst(this.currentEl, this.el)
    this.emitEvent('back')
  }

  /**
   * Reset the drilldown to the root level
   */
  public reset() {
    if (!this.wrapper || this.level === 0)
      return

    const nextsButtonExpanded = this.wrapper.querySelectorAll<HTMLElement>('.c-drilldown-next[aria-expanded="true"]')
    nextsButtonExpanded.forEach((nextButton) => {
      nextButton.setAttribute('aria-expanded', 'false')
    })
    this.currentEl = this.wrapper
    this.level = 0
    this.update()
    if (this.currentEl)
      focusFirst(this.currentEl, this.el)
    this.emitEvent('reset')
  }

  public destroy() {
    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    this.wrapper?.removeAttribute('role')
    this.wrapper?.removeAttribute('aria-multiselectable')
    this.wrapper?.removeAttribute('aria-orientation')
    this.wrapper?.querySelectorAll('.c-drilldown-menu').forEach((menu) => {
      menu.removeAttribute('role')
    })

    const items = this.el.querySelectorAll('.c-drilldown-menu > li')
    items.forEach((item) => {
      item.removeAttribute('role')
    })

    const backs = this.el.querySelectorAll('.c-drilldown-back')
    const nexts = this.el.querySelectorAll('.c-drilldown-next')
    backs.forEach((back) => {
      back.removeAttribute('role')
    })
    nexts.forEach((next) => {
      next.removeAttribute('role')
      next.removeAttribute('aria-expanded')
      if (!next.getAttribute('aria-controls')) {
        const menu = next.parentElement?.querySelector('.c-drilldown-menu')
        next.removeAttribute('aria-controls')
        menu?.removeAttribute('id')
      }
    })
    const elsBeenDisable = this.el.querySelectorAll('[data-c-hidden]')
    elsBeenDisable.forEach((el) => {
      el.removeAttribute(this.hiddenData)
      el.removeAttribute('tabindex')
    })

    this.wrapper?.style.removeProperty(this.delayCssVar)
    super.destroy()
  }
}
