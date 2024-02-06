import '@css/dropdown.css'
import { Dropdown } from '@src/index'

const el = document.querySelector<HTMLElement>('.c-dropdown')
if (el) {
  const _dropdown = new Dropdown(el)
}
