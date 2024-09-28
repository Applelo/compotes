/* eslint-disable no-console */
import Parent from '@src/components/_parent'

class Child extends Parent {
  public readonly name = 'child'

  constructor(el: HTMLElement | string, options = {}) {
    super()
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el?: HTMLElement | string, options = {}) {
    super.init(el, options)
  }

  protected initEvents(): void {

  }
}

const el = document.querySelector<HTMLElement>('.c-parent')
if (el) {
  const child = new Child(el, { init: false })

  el.addEventListener('c.child.init', () => {
    console.log('c.child.init')
    child.destroy()
  })

  el.addEventListener('c.child.destroy', () => console.log('c.child.destroy'))

  child.init()
}
