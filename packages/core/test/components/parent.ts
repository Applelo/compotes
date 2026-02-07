import type { Events, ParentOptions } from '@src/components/_parent'
/* eslint-disable no-console */
import Parent from '@src/components/_parent'

class Child extends Parent<Events> {
  public readonly name = 'child'

  constructor(el: HTMLElement | string, options: ParentOptions<Events> = {}) {
    super()
    console.log(this.isInitializable)
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el?: HTMLElement | string, options: ParentOptions<Events> = {}) {
    super.init(el, options)
  }

  protected initEvents(): void {

  }
}

const el = document.querySelector<HTMLElement>('.c-parent')
if (el) {
  const child = new Child(el, {
    init: false,
    on: {
      init: (e) => {
        console.log('c.child.init')
        e.detail.destroy()
      },
    },
  })

  el.addEventListener('c.child.init', () => console.log('c.child.init'))

  el.addEventListener('c.child.destroy', () => console.log('c.child.destroy'))

  child.init()
}
