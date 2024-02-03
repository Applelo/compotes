import Parent, { type ParentOptions } from './_parent'

declare global {
  interface HTMLElementEventMap {
    'c.drag.init': CustomEvent<Drag>
    'c.drag.start': CustomEvent<Drag>
    'c.drag.end': CustomEvent<Drag>
    'c.drag.destroy': CustomEvent<Drag>
  }
}

export interface DragOptions extends ParentOptions {}

export default class Drag extends Parent {
  declare public opts: DragOptions
  private isDown = false
  private draggableClass = 'c-drag--draggable'
  private draggingClass = 'c-drag--dragging'
  private startX = 0
  private startY = 0
  private scrollLeft = 0
  private scrollTop = 0
  private hasMoved = false

  private resizeObserver?: ResizeObserver

  constructor(el: HTMLElement | string, options: DragOptions = {}) {
    super(el, options)
    if (this.isInitializable)
      this.init()
  }

  public init() {
    this.name = 'drag'
    super.init()

    this.resizeObserver = new ResizeObserver(() => {
      this.el.classList.toggle(this.draggableClass, this.isDraggable)
    })

    this.resizeObserver.observe(this.el)
  }

  public initAccessibilityAttrs() {}

  public initEvents() {
    this.destroyEvents()

    const mouseEvents = ['mouseleave', 'mouseup']
    mouseEvents.forEach((event) => {
      this.registerEvent({
        id: 'handleDragEnd',
        function: this.handleDragEnd.bind(this),
        event,
        el: this.el,
      })
    })

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
    if (!this.isDraggable)
      return
    this.isDown = true
    this.el.classList.add(this.draggingClass)
    this.startX = e.pageX - this.el.offsetLeft
    this.startY = e.pageY - this.el.offsetTop
    this.scrollLeft = this.el.scrollLeft
    this.scrollTop = this.el.scrollTop
    this.emitEvent('start')
  }

  private handleDragEnd() {
    this.isDown = false
    this.el.classList.remove(this.draggingClass)
    this.emitEvent('end')
  }

  private handleDragMove(e: MouseEvent) {
    if (!this.isDown)
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
    super.destroy()
  }
}
