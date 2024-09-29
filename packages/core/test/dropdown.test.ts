import type { Browser } from 'playwright'
import { chromium } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { destroyComponent } from './helper/destroy'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  browser.close()
})

describe('dropdown', async () => {
  it.concurrent('events', async () => {
    const page = await browser.newPage()
    const events = [
      'c.dropdown.opened',
      'c.dropdown.closed',
    ]
    const openedEvent = page.waitForEvent('console', msg => msg.text().includes('c.dropdown.opened'))
    const closedEvent = page.waitForEvent('console', msg => msg.text().includes('c.dropdown.closed'))
    await page.goto('http://localhost:3000/dropdown.html')

    await page.evaluate(() => {
      const el = document.querySelector('.c-dropdown')
      if (!el)
        return
      [
        'c.dropdown.opened',
        'c.dropdown.closed',
      ].forEach((e) => {
        el.addEventListener(e, () => {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      })
    })

    const triggerBtn = page.locator('.c-dropdown-trigger').first()
    await triggerBtn.click()
    await triggerBtn.click()

    const result = (await Promise.all([
      openedEvent,
      closedEvent,
    ])).map(item => item.text())

    events.forEach(e => expect(result).toContain(e))
  })

  it.concurrent('destroy', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:3000/dropdown.html')
    const { before, after } = await destroyComponent(page)
    expect(before).not.toEqual(after)
    expect(after).toMatchSnapshot()
  })
})
