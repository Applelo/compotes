import '@css/drag.css'
import { Collapse } from '@src/index'

const el = document.querySelector<HTMLElement>('.c-collapse')
if (el) {
  const _collapse = new Collapse(el)
}
