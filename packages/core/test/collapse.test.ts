import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Browser } from 'playwright'
import { chromium } from 'playwright'
import type { PreviewServer } from 'vite'
import { mergeConfig, preview } from 'vite'
import { config } from './global'

let browser: Browser
let server: PreviewServer

beforeAll(async () => {
  browser = await chromium.launch()
  server = await preview(mergeConfig(config, { preview: { port: 3001 } }))
})

afterAll(async () => {
  browser.close()
  server.httpServer.close()
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
    await page.goto('http://127.0.0.1:3001/collapse.html')

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
    triggerEl.click()
    await shownEvent
    triggerEl.click()

    const result = (await Promise.all([
      showEvent,
      shownEvent,
      hideEvent,
      hiddenEvent,
    ])).map(item => item.text())

    events.forEach(e => expect(result).toContain(e))
  })
})
