import { Marquee } from '@src/index'
import '@css/marquee.css'

const el = document.querySelector<HTMLElement>('.c-marquee')
const play = document.querySelector('.js-marquee-play')
const pause = document.querySelector('.js-marquee-pause')
if (el) {
  const marquee = new Marquee(el, {
    duration: '1s',
  })

  play?.addEventListener('click', () => {
    marquee.play()
  })

  pause?.addEventListener('click', () => {
    marquee.pause()
  })

  const destroyBtn = document.querySelector<HTMLButtonElement>('.js-destroy')
  destroyBtn?.addEventListener('click', () => marquee.destroy())
}
