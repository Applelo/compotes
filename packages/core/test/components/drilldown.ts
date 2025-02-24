import { Drilldown } from '@src/index'
import '@css/drag.css'

const el = document.querySelector<HTMLElement>('.c-drilldown')
const reset = document.querySelector<HTMLElement>('.js-drilldown-reset')
if (el) {
  const drilldown = new Drilldown(el)
  reset?.addEventListener('click', () => drilldown.reset())
  const destroyBtn = document.querySelector<HTMLButtonElement>('.js-destroy')
  destroyBtn?.addEventListener('click', () => drilldown.destroy())
}
