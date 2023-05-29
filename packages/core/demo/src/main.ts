import { Collapse, Drilldown } from './../../src'
import './styles.css'
import './../../src/assets/css/drilldown.css'
import './../../src/assets/css/collapse.css'

const drilldown = new Drilldown('.c-drilldown', {
  dynamicHeight: true,
  init: false,
})
drilldown.init()

const collapse = new Collapse('.c-collapse', {
  init: false,
})
collapse.init()
