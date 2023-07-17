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

describe.concurrent('parent', async () => {
  it('events', async () => {
    const page = await browser.newPage()
    const initEvent = page.waitForEvent('console', msg => msg.text().includes('c.child.init'))
    const destroyEvent = page.waitForEvent('console', msg => msg.text().includes('c.child.destroy'))
    await page.goto('http://127.0.0.1:4173/parent.html')

    const result = (await Promise.all([initEvent, destroyEvent])).map(item => item.text())
    expect(result).toContain('c.child.init')
    expect(result).toContain('c.child.destroy')
  })
})
