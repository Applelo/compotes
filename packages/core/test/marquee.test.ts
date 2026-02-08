import type { Events } from '@src/components/marquee'
import Marquee from '@src/components/marquee'
import { beforeAll, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { registerEventListeners } from './helper'
import '@css/marquee.css'

type MarqueeEvents = `c.marquee.${Events}`

let bodyHTML: string = ''

beforeAll(() => {
  const html = `
  <div>
    <div class="c-marquee" data-testid="marquee" style="width: 200px;">
      <ul class="c-marquee-container">
        <li>Marquee Left Direction</li>
        <li><img width="25" height="25" src="https://vitejs.dev/logo.svg"/></li>
      </ul>
    </div>
  </div>
`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return () => {
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('marquee', async () => {
  const marqueeLoc = page.getByTestId('marquee')

  expect(marqueeLoc).toBeInTheDocument()

  const { callback: playEvent, removeEventListener: removePlayEvent } = registerEventListeners<MarqueeEvents>('c.marquee.play', marqueeLoc)
  const { callback: pauseEvent, removeEventListener: removePauseEvent } = registerEventListeners<MarqueeEvents>('c.marquee.pause', marqueeLoc)
  const { callback: loopEvent, removeEventListener: removeLoopEvent } = registerEventListeners<MarqueeEvents>('c.marquee.loop', marqueeLoc)

  const marquee = new Marquee(marqueeLoc.element() as HTMLElement, {
    duration: '1s',
    direction: 'left',
    behavior: 'alternate',
  })

  expect(marqueeLoc.element()).matchSnapshot()

  marquee.pause()
  expect(pauseEvent).toHaveBeenCalledTimes(1)

  marquee.play()
  expect(playEvent).toHaveBeenCalledTimes(1)

  await new Promise(resolve => setTimeout(resolve, 1100))
  expect(loopEvent).toHaveBeenCalledTimes(1)

  marquee.destroy()

  removePlayEvent()
  removePauseEvent()
  removeLoopEvent()
})
