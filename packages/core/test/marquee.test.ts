import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Browser } from 'playwright'
import { chromium } from 'playwright'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  browser.close()
})

describe('marquee', async () => {
  it.concurrent('events', async () => {
    const page = await browser.newPage()
    const events = [
      'c.marquee.play',
      'c.marquee.pause',
      'c.marquee.loop',
    ]
    const playEvent = page.waitForEvent('console', msg => msg.text().includes('c.marquee.play'))
    const pauseEvent = page.waitForEvent('console', msg => msg.text().includes('c.marquee.pause'))
    const loopEvent = page.waitForEvent('console', msg => msg.text().includes('c.marquee.loop'))
    await page.goto('http://localhost:3000/marquee.html')

    await page.evaluate(() => {
      const el = document.querySelector('.c-marquee')
      if (!el)
        return
      [
        'c.marquee.play',
        'c.marquee.pause',
        'c.marquee.loop',
      ].forEach((e) => {
        el.addEventListener(e, () => {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      })
    })

    const playBtn = page.locator('.js-marquee-play').first()
    const pauseBtn = page.locator('.js-marquee-pause').first()
    await pauseBtn.click()
    await playBtn.click()

    const result = (await Promise.all([
      playEvent,
      pauseEvent,
      loopEvent,
    ])).map(item => item.text())

    events.forEach(e => expect(result).toContain(e))
  })
})
