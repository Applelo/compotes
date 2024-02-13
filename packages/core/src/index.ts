import type { CollapseOptions } from './components/collapse'
import type { DragOptions } from './components/drag'
import type { DrilldownOptions } from './components/drilldown'
import type { DropdownOptions } from './components/dropdown'
import type { MarqueeOptions } from './components/marquee'
import Collapse from './components/collapse'
import Drag from './components/drag'
import Drilldown from './components/drilldown'
import Dropdown from './components/dropdown'
import Marquee from './components/marquee'

import.meta.glob(['@css/*.css'], {
  eager: true,
})

export type {
  CollapseOptions,
  DragOptions,
  DrilldownOptions,
  DropdownOptions,
  MarqueeOptions,
}

export {
  Collapse,
  Drag,
  Drilldown,
  Dropdown,
  Marquee,
}
