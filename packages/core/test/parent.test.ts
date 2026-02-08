import type { Events, ParentOptions } from '@src/components/_parent'
import Parent from '@src/components/_parent'
import { beforeAll, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { registerEventListeners } from './helper'

type ChildEvents = `c.child.${Events}`

class Child extends Parent<Events> {
  public readonly name = 'child'

  constructor(el: HTMLElement | string, options: ParentOptions<Events> = {}) {
    super()
    this.opts = options
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el?: HTMLElement | string, options?: ParentOptions<Events>) {
    super.init(el, options)
  }

  protected initEvents(): void {
  }
}

beforeAll(() => {
  const html = `
  <div>
    <div class="c-parent" data-testid="parent"></div>
  </div>
`
  document.body.innerHTML = html
})

it('parent', () => {
  const parentLoc = page.getByTestId('parent')

  const { callback: initEvent, removeEventListener: removeInitEvent } = registerEventListeners<ChildEvents>('c.child.init', parentLoc)
  const { callback: destroyEvent, removeEventListener: removeDestroyEvent } = registerEventListeners<ChildEvents>('c.child.destroy', parentLoc)

  const onInit = vi.fn((e: CustomEvent<Parent<Events>>) => {
    expect(e.detail).toBeInstanceOf(Parent)
  })
  const onDestroy = vi.fn()

  const child = new Child(parentLoc.element() as HTMLElement, {
    init: false,
    on: {
      init: onInit,
      destroy: onDestroy,
    },
  })

  expect(child.el).toBeNull()

  child.init(parentLoc.element() as HTMLElement)

  expect(child.el).not.toBeNull()
  expect(initEvent).toHaveBeenCalledTimes(1)
  expect(onInit).toHaveBeenCalledTimes(1)
  child.destroy()

  expect(destroyEvent).toHaveBeenCalledTimes(1)
  expect(onDestroy).toHaveBeenCalledTimes(1)

  removeInitEvent()
  removeDestroyEvent()
})
