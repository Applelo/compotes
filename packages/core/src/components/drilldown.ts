import type { ParentOptions } from './_parent'
import { tabbable } from 'tabbable'
import { focusChar, focusFirst, focusLast, focusSibling, generateId } from '../utils/accessibility'
import { getTransitionDuration } from './../utils/animation'
import Parent from './_parent'

enum Events {
  Init = 'init',
  Destroy = 'destroy',
  Update = 'update',
  Next = 'next',
  Back = 'back',
  Reset = 'reset',
}

declare global {
  interface HTMLElementEventMap extends Record<`c.drilldown.${Events}`, CustomEvent<Drilldown>> {}
}

export interface DrilldownOptions extends ParentOptions<Events> {
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

export default class Drilldown extends Parent<Events> {
  public readonly name = 'drilldown'
  declare protected opts: DrilldownOptions

  // Constant
  private static readonly CLASS_MENU = 'c-drilldown-menu'
  private static readonly CLASS_BACK = 'c-drilldown-back'
  private static readonly CLASS_NEXT = 'c-drilldown-next'

  private static readonly DATA_HIDDEN = 'data-c-hidden'

  private static readonly SELECTOR_MENU = `.${Drilldown.CLASS_MENU}`
  private static readonly SELECTOR_MENU_ITEMS = `.${Drilldown.CLASS_MENU} > li`
  private static readonly SELECTOR_BACK = `.${Drilldown.CLASS_BACK}`
  private static readonly SELECTOR_NEXT = `.${Drilldown.CLASS_NEXT}`
  private static readonly SELECTOR_DATA_HIDDEN = `[${Drilldown.DATA_HIDDEN}]`

  private static readonly CSSVAR_DELAY = '--c-drilldown-delay'

  private currentEl: HTMLUListElement | null = null
  private wrapper: HTMLUListElement | null = null
  private items: DrilldownItem[] = []
  private level = 0

  private resizeObserver?: ResizeObserver
  private mutationObserver?: MutationObserver

  constructor(el: HTMLElement | string, options: DrilldownOptions = {}) {
    super()
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el: HTMLElement | string, options: DrilldownOptions = {}) {
    super.init(el, options)
    this.initAccessibilityAttrs()

    if (!this.el)
      return

    this.currentEl = this.el.querySelector<HTMLUListElement>(Drilldown.SELECTOR_MENU) || null
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

    this.update(true)
  }

  public initAccessibilityAttrs() {
    if (!this.el)
      return

    this.wrapper?.setAttribute('role', 'menubar')
    this.wrapper?.setAttribute('aria-multiselectable', 'false')
    this.wrapper?.setAttribute('aria-orientation', 'vertical')
    this.wrapper?.querySelectorAll(Drilldown.SELECTOR_MENU).forEach((menu) => {
      menu.setAttribute('role', 'menu')
    })

    const items = this.el.querySelectorAll(Drilldown.SELECTOR_MENU_ITEMS)
    items.forEach((item) => {
      item.setAttribute('role', 'none')
    })

    const backs = this.el.querySelectorAll(Drilldown.SELECTOR_BACK)
    const nexts = this.el.querySelectorAll(Drilldown.SELECTOR_NEXT)
    backs.forEach((back) => {
      back.setAttribute('role', 'menuitem')
    })
    nexts.forEach((next) => {
      next.setAttribute('role', 'menuitem')
      next.setAttribute('aria-expanded', 'false')
      if (!next.getAttribute('aria-controls')) {
        const menu = next.parentElement?.querySelector(Drilldown.SELECTOR_MENU)
        const id = menu?.id || generateId()
        next.setAttribute('aria-controls', id)
        menu?.setAttribute('id', id)
      }
    })
  }

  protected initEvents() {
    if (!this.el)
      return

    const backs = this.el.querySelectorAll(Drilldown.SELECTOR_BACK)
    const nexts = this.el.querySelectorAll(Drilldown.SELECTOR_NEXT)
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

    this.initAccessibilityEvents()
  }

  /**
   * Init accessibility events.
   * Inspired by https://www.w3.org/WAI/ARIA/apg/patterns/menu/ controls
   */
  public initAccessibilityEvents() {
    if (!this.el)
      return

    this.registerEvent({
      id: 'key',
      event: 'keydown',
      el: this.el,
      function: (e: KeyboardEvent) => {
        if (!this.el)
          return

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
              && activeElement.classList.contains(Drilldown.CLASS_NEXT)
            ) {
              this.next(activeElement)
            }
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
    this.wrapper.style.setProperty(Drilldown.CSSVAR_DELAY, `${delay}ms`)
    this.disableFocusElements()

    if (reloadItems) {
      this.updateItems(this.wrapper)
      this.updateHeight()
      this.initAccessibilityAttrs()

      return
    }

    if (this.opts.dynamicHeight === true)
      this.updateHeight()

    this.emitEvent(Events.Update)
  }

  private updateItems(menu: HTMLUListElement, level = 0) {
    const children = menu.children

    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      const menu = child.querySelector<HTMLUListElement>(Drilldown.SELECTOR_MENU)
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
    if (!this.el)
      return

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
    if (!this.el)
      return

    const elsBeenDisable = this.el.querySelectorAll(Drilldown.SELECTOR_DATA_HIDDEN)
    elsBeenDisable.forEach((el) => {
      el.removeAttribute(Drilldown.DATA_HIDDEN)
      el.removeAttribute('tabindex')
    })

    if (!this.currentEl)
      return

    const tabbables = tabbable(this.el)
    tabbables.forEach((item) => {
      const menu = item.closest(Drilldown.SELECTOR_MENU)
      if (menu === this.currentEl)
        return

      item.setAttribute(Drilldown.DATA_HIDDEN, 'true')
      item.setAttribute('tabindex', '-1')
    })
  }

  /**
   * Go to the next panel
   *
   * @param {(HTMLButtonElement | Event)} button
   */
  private next(button: HTMLButtonElement | MouseEvent) {
    if (!this.el)
      return

    const nextButton = this.getButton(button, 'next')

    if (!nextButton)
      return

    nextButton.setAttribute('aria-expanded', 'true')
    this.level++
    this.currentEl = nextButton.parentElement?.querySelector<HTMLUListElement>(Drilldown.SELECTOR_MENU) || null
    this.update()
    if (this.currentEl)
      focusFirst(this.currentEl, this.el)
    this.emitEvent(Events.Next)
  }

  /**
   * Back to one level
   */
  public back() {
    if (!this.el)
      return

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
    this.currentEl = nextButton.closest<HTMLUListElement>(Drilldown.SELECTOR_MENU)
    this.update()
    if (this.currentEl)
      focusFirst(this.currentEl, this.el)
    this.emitEvent(Events.Back)
  }

  /**
   * Reset the drilldown to the root level
   */
  public reset() {
    if (!this.el)
      return

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
    this.emitEvent(Events.Reset)
  }

  public destroy() {
    if (!this.el)
      return

    this.mutationObserver?.disconnect()
    this.resizeObserver?.disconnect()
    this.wrapper?.removeAttribute('role')
    this.wrapper?.removeAttribute('aria-multiselectable')
    this.wrapper?.removeAttribute('aria-orientation')
    this.wrapper?.querySelectorAll(Drilldown.SELECTOR_MENU).forEach((menu) => {
      menu.removeAttribute('role')
    })

    const items = this.el.querySelectorAll(Drilldown.SELECTOR_MENU_ITEMS)
    items.forEach((item) => {
      item.removeAttribute('role')
    })

    const backs = this.el.querySelectorAll(Drilldown.SELECTOR_BACK)
    const nexts = this.el.querySelectorAll(Drilldown.SELECTOR_NEXT)
    backs.forEach((back) => {
      back.removeAttribute('role')
    })
    nexts.forEach((next) => {
      next.removeAttribute('role')
      next.removeAttribute('aria-expanded')
      next.removeAttribute('aria-controls')
      const menu = next.parentElement?.querySelector(Drilldown.SELECTOR_MENU)
      if (menu && menu.id.startsWith('c-id-'))
        menu.removeAttribute('id')
    })
    const elsBeenDisable = this.el.querySelectorAll(Drilldown.SELECTOR_DATA_HIDDEN)
    elsBeenDisable.forEach((el) => {
      el.removeAttribute(Drilldown.DATA_HIDDEN)
      el.removeAttribute('tabindex')
    })

    this.wrapper?.style.removeProperty(Drilldown.CSSVAR_DELAY)
    super.destroy()
  }
}
