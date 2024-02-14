import '@css/drag.css'
import { Collapse } from '@src/index'

const el = document.querySelector<HTMLElement>('.c-collapse')
if (el) {
  const collapse = new Collapse(el)
  const destroyBtn = document.querySelector<HTMLButtonElement>('.js-destroy')
  destroyBtn?.addEventListener('click', () => collapse.destroy())
}
