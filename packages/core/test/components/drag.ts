import { Drag } from '@src/index'
import '@css/drag.css'

const el = document.querySelector<HTMLElement>('.c-drag')
if (el) {
  const drag = new Drag(el)
  const destroyBtn = document.querySelector<HTMLButtonElement>('.js-destroy')
  destroyBtn?.addEventListener('click', () => drag.destroy())
}
