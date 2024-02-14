import '@css/dropdown.css'
import { Dropdown } from '@src/index'

const el = document.querySelector<HTMLElement>('.c-dropdown')
if (el) {
  const dropdown = new Dropdown(el)
  const destroyBtn = document.querySelector<HTMLButtonElement>('.js-destroy')
  destroyBtn?.addEventListener('click', () => dropdown.destroy())
}
