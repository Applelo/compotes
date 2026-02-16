import type { Events, ParentOptions } from '@src/components/_parent'
import Parent from '@src/components/_parent'
import { beforeAll, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { registerEventListeners } from './helper'

type ChildEvents = `c.child.${Events}`

class Child extends Parent<Events> {
  public readonly name = 'child'

  constructor(el?: HTMLElement | string, options: ParentOptions<Events> = {}) {
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

  protected getState(): any {
    return { name: this.name }
  }
}

let bodyHTML: string = ''

beforeAll(() => {
  const html = `
  <div>
    <div class="c-parent" data-testid="parent"></div>
  </div>
`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return () => {
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('parent', () => {
  const parentLoc = page.getByTestId('parent')
  expect(parentLoc).toBeInTheDocument()

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

it('parent init with no element returns early', () => {
  const child = new Child(undefined, { init: false })
  child.init()
  expect(child.el).toBeNull()
})

it('parent init with invalid selector throws', () => {
  expect(() => new Child('#non-existent-element')).toThrowError(
    'The element/selector provided cannot be found.',
  )
})

it('parent on option with undefined handler', () => {
  const parentLoc = page.getByTestId('parent')
  const child = new Child(parentLoc.element() as HTMLElement, {
    on: {
      init: undefined,
      destroy: vi.fn(),
    },
  })
  // Should not throw — undefined handler is skipped via continue
  expect(child.el).not.toBeNull()
  child.destroy()
})

it('parent onStateChange callback', () => {
  const parentLoc = page.getByTestId('parent')
  const onStateChange = vi.fn()
  const child = new Child(parentLoc.element() as HTMLElement, {
    onStateChange,
  })
  // onStateChange is called during init (via emitEvent)
  expect(onStateChange).toHaveBeenCalled()
  expect(onStateChange).toHaveBeenCalledWith({ name: 'child' })
  child.destroy()
})

it('parent registerEvent guard after destroy', () => {
  const parentLoc = page.getByTestId('parent')
  const child = new Child(parentLoc.element() as HTMLElement)
  child.destroy()
  // After destroy, eventsController is aborted; triggering events should not throw
  const el = parentLoc.element() as HTMLElement
  el.dispatchEvent(new Event('click', { bubbles: true }))
  expect(child.el).not.toBeNull()
})
