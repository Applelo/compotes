import '@css/drag.css'
import { Drag } from '@src/index'

const el = document.querySelector<HTMLElement>('.c-drag')
if (el) {
  const _drag = new Drag(el)
}
