import Parent, { ParentOptions } from '../_parent';

export interface DrilldownOptions extends ParentOptions {

}

export default class Drilldown extends Parent {
  constructor(el:HTMLElement, options: DrilldownOptions = {}) {
    super(el, options)
  }

  public init() {
    super.init()
  }

  public destroy() {
    super.destroy()
  }
}