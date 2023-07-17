import './../../../core/src/assets/css/drag.css'
import { Drag } from './../../src'

const el = document.querySelector<HTMLElement>('.c-drag')
if (el) {
  const _drag = new Drag(el)
}
