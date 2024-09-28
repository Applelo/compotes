import Parent, { type ParentOptions } from './_parent'

enum Events {
  Init = 'init',
  Start = 'start',
  End = 'end',
  Destroy = 'destroy',
}

declare global {
  interface HTMLElementEventMap extends Record<`c.drag.${Events}`, CustomEvent<Drag>> {}
}

export interface DragOptions extends ParentOptions<Events> {}

export default class Drag extends Parent<Events> {
  public readonly name = 'drag'
  declare protected opts: DragOptions

  // Constant
  private static readonly CLASS_DRAGGABLE = 'c-drag--draggable'
  private static readonly CLASS_DRAGGING = 'c-drag--dragging'

  private isDown = false
  private startX = 0
  private startY = 0
  private scrollLeft = 0
  private scrollTop = 0
  private hasMoved = false

  private resizeObserver?: ResizeObserver

  constructor(el: HTMLElement | string, options: DragOptions = {}) {
    super()
    if (this.isInitializable)
      this.init(el, options)
  }

  public init(el: HTMLElement | string, options: DragOptions = {}) {
    super.init(el, options)

    if (!this.el)
      return

    this.resizeObserver = new ResizeObserver(() => {
      this.el?.classList.toggle(Drag.CLASS_DRAGGABLE, this.isDraggable)
    })

    this.resizeObserver.observe(this.el)
  }

  protected initEvents() {
    if (!this.el)
      return

    const mouseEvents: (keyof HTMLElementEventMap)[] = ['mouseleave', 'mouseup']
    for (let index = 0; index < mouseEvents.length; index++) {
      const event = mouseEvents[index]
      this.registerEvent({
        id: 'handleDragEnd',
        function: this.handleDragEnd.bind(this),
        event,
        el: this.el,
      })
    }

    this.registerEvent({
      id: 'handleDragMove',
      function: this.handleDragMove.bind(this),
      event: 'mousemove',
      el: this.el,
    })

    this.registerEvent({
      id: 'handleDragStart',
      function: this.handleDragStart.bind(this),
      event: 'mousedown',
      el: this.el,
    })

    this.registerEvent({
      id: 'handleClick',
      function: this.blockClick.bind(this),
      event: 'click',
      el: this.el,
    })
  }

  private blockClick(e: MouseEvent) {
    if (!this.hasMoved)
      return

    e.preventDefault()
    this.hasMoved = false
  }

  private handleDragStart(e: MouseEvent) {
    if (!this.isDraggable || !this.el)
      return
    this.isDown = true
    this.el.classList.add(Drag.CLASS_DRAGGING)
    this.startX = e.pageX - this.el.offsetLeft
    this.startY = e.pageY - this.el.offsetTop
    this.scrollLeft = this.el.scrollLeft
    this.scrollTop = this.el.scrollTop
    this.emitEvent('start')
  }

  private handleDragEnd() {
    if (!this.el)
      return
    this.isDown = false
    this.el.classList.remove(Drag.CLASS_DRAGGING)
    this.emitEvent('end')
  }

  private handleDragMove(e: MouseEvent) {
    if (!this.isDown || !this.el)
      return
    e.preventDefault()

    const x = e.pageX - this.el.offsetLeft - this.startX
    const y = e.pageY - this.el.offsetTop - this.startY

    const newX = this.scrollLeft - x
    const newY = this.scrollTop - y

    if (this.el.scrollLeft !== newX || this.el.scrollTop !== newY)
      this.hasMoved = true

    this.el.scrollLeft = newX
    this.el.scrollTop = newY
  }

  /**
   * Tell if the element is draggable or not
   */
  public get isDraggable() {
    if (!this.el)
      return false
    return this.el.clientHeight !== this.el.scrollHeight
      || this.el.clientWidth !== this.el.scrollWidth
  }

  /**
   * Tell if the element is dragging
   */
  public get isDragging() {
    return this.isDown
  }

  public destroy() {
    this.resizeObserver?.disconnect()
    this.el?.classList.remove(Drag.CLASS_DRAGGING)
    this.el?.classList.remove(Drag.CLASS_DRAGGABLE)
    super.destroy()
  }
}
