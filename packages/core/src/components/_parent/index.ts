export interface ParentOptions {
  init?:boolean
}

export default abstract class Parent {
  protected el: HTMLElement;
  public opts: Record<string, any>;

  constructor(el: HTMLElement, options: ParentOptions) {
    this.el = el
    this.opts = options;
    if (typeof options.init === 'undefined' || options.init === true)
      this.init()
  }

  protected emitEvent(name: string) {
    const event = new CustomEvent(name, {detail: this})
    this.el.dispatchEvent(event)
  }

  protected init():void {
    this.emitEvent('init')
  };
  protected destroy():void {
    this.emitEvent('destroy')
  };

  public get element():HTMLElement {
    return this.el
  }
  public get options():ParentOptions {
    return this.options
  }
}