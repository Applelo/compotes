import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Browser } from 'playwright'
import { chromium } from 'playwright'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch({
    headless: false,
  })
})

afterAll(async () => {
  browser.close()
})

describe.concurrent('drag', async () => {
  it('events', async () => {
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:4173/drag.html')
    const dragEl = page.locator('.c-drag')
    const lastDragEl = page.locator('.c-drag p:last-child').last()

    expect(dragEl).not.toBeNull()
    expect(lastDragEl).not.toBeNull()
    if (!dragEl || !lastDragEl)
      return

    const dragElBoundingBox = await dragEl.boundingBox()
    const previousLastDragElBoundingBox = await lastDragEl.boundingBox()

    expect(dragElBoundingBox).not.toBeNull()
    expect(previousLastDragElBoundingBox).not.toBeNull()
    if (!dragElBoundingBox || !previousLastDragElBoundingBox)
      return

    await page.mouse.move(
      dragElBoundingBox.x + dragElBoundingBox.width / 2,
      dragElBoundingBox.y + dragElBoundingBox.height / 3,
    )
    await page.mouse.down()
    await page.mouse.move(
      dragElBoundingBox.x + dragElBoundingBox.width / 2,
      dragElBoundingBox.y + dragElBoundingBox.height / 3 * 2,
    )
    await page.mouse.up()

    // await new Promise(resolve => setTimeout(() => {
    //   resolve(true)
    // }, 5000))

    const currentLastDragElBoundingBox = await lastDragEl.boundingBox()
    expect(currentLastDragElBoundingBox).not.toBeNull()
    expect(currentLastDragElBoundingBox).not.toEqual(previousLastDragElBoundingBox)
  })
})
