import { Collapse, Drilldown } from './../../src'
import './styles.css'
import './../../src/assets/css/drilldown.css'
import './../../src/assets/css/collapse.css'

const drilldown = new Drilldown('.c-drilldown', {
  dynamicHeight: true,
  init: false,
})
drilldown.init()

const collapses = document.querySelectorAll<HTMLElement>('.c-collapse')
collapses.forEach((el) => {
  const collapse = new Collapse(el, {
    init: false,
  })
  collapse.init()
})
