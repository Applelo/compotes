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

describe('collapse', async () => {
  it.concurrent('events', async () => {
    const page = await browser.newPage()
    const events = [
      'c.collapse.show',
      'c.collapse.hide',
      'c.collapse.hidden',
      'c.collapse.shown',
    ]
    const showEvent = page.waitForEvent('console', msg => msg.text().includes('c.collapse.show'))
    const hideEvent = page.waitForEvent('console', msg => msg.text().includes('c.collapse.hide'))
    const shownEvent = page.waitForEvent('console', msg => msg.text().includes('c.collapse.shown'))
    const hiddenEvent = page.waitForEvent('console', msg => msg.text().includes('c.collapse.hidden'))
    await page.goto('http://localhost:3000/collapse.html')

    await page.evaluate(() => {
      const el = document.querySelector('.c-collapse')
      if (!el)
        return
      [
        'c.collapse.show',
        'c.collapse.hide',
        'c.collapse.hidden',
        'c.collapse.shown',
      ].forEach((e) => {
        el.addEventListener(e, () => {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      })
    })

    const triggerEl = page.locator('.c-collapse-trigger').first()
    await triggerEl.click()
    await shownEvent
    await triggerEl.click()

    const result = (await Promise.all([
      showEvent,
      shownEvent,
      hideEvent,
      hiddenEvent,
    ])).map(item => item.text())

    events.forEach(e => expect(result).toContain(e))
  })
})
