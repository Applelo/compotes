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
  server = await preview(mergeConfig(config, { preview: { port: 3000 } }))
})

afterAll(async () => {
  browser.close()
  server.httpServer.close()
})

describe('parent', async () => {
  it('events', async () => {
    const page = await browser.newPage()
    const initEvent = page.waitForEvent('console', msg => msg.text().includes('c.child.init'))
    const destroyEvent = page.waitForEvent('console', msg => msg.text().includes('c.child.destroy'))
    await page.goto('http://127.0.0.1:3000/parent.html')

    const result = (await Promise.all([initEvent, destroyEvent])).map(item => item.text())
    expect(result).toContain('c.child.init')
    expect(result).toContain('c.child.destroy')
  })
})
