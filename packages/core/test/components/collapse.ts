import { Collapse } from '@src/index'
import '@css/drag.css'

const el = document.querySelector<HTMLElement>('.c-collapse')
if (el) {
  const collapse = new Collapse(el)
  const destroyBtn = document.querySelector<HTMLButtonElement>('.js-destroy')
  destroyBtn?.addEventListener('click', () => collapse.destroy())
}
