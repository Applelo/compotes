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

describe('drilldown', async () => {
  it.concurrent('generateId', async () => {
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:4173/drilldown.html')
    const item = page.locator('#c-id-1').first()
    expect(item).toBeDefined()
  })

  it.concurrent('events', async () => {
    const page = await browser.newPage()
    const events = [
      'c.drilldown.update',
      'c.drilldown.next',
      'c.drilldown.back',
      'c.drilldown.reset',
    ]
    const updateEvent = page.waitForEvent('console', msg => msg.text().includes('c.drilldown.update'))
    const nextEvent = page.waitForEvent('console', msg => msg.text().includes('c.drilldown.next'))
    const backEvent = page.waitForEvent('console', msg => msg.text().includes('c.drilldown.back'))
    const resetEvent = page.waitForEvent('console', msg => msg.text().includes('c.drilldown.reset'))
    await page.goto('http://127.0.0.1:4173/drilldown.html')

    await page.evaluate(() => {
      const el = document.querySelector('.c-drilldown')
      if (!el)
        return
      [
        'c.drilldown.update',
        'c.drilldown.next',
        'c.drilldown.back',
        'c.drilldown.reset',
      ].forEach((e) => {
        el.addEventListener(e, () => {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      })
    })

    const nextBtn = page.locator('.c-drilldown-next').first()
    const backBtn = page.locator('.c-drilldown-back').first()
    const resetBtn = page.locator('.js-drilldown-reset').first()

    nextBtn.click()
    await nextEvent
    backBtn.click()
    await backEvent
    nextBtn.click()
    resetBtn.click()

    const result = (await Promise.all([
      updateEvent,
      nextEvent,
      backEvent,
      resetEvent,
    ])).map(item => item.text())

    events.forEach(e => expect(result).toContain(e))
  })
})
