import '@css/marquee.css'
import { Marquee } from '@src/index'

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
}
