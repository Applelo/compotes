import { Dropdown } from '@src/index'
import '@css/dropdown.css'

const el = document.querySelector<HTMLElement>('.c-dropdown')
if (el) {
  const dropdown = new Dropdown(el)
  const destroyBtn = document.querySelector<HTMLButtonElement>('.js-destroy')
  destroyBtn?.addEventListener('click', () => dropdown.destroy())
}
