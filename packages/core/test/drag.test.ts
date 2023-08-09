import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Browser, Page } from 'playwright'
import { chromium } from 'playwright'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  browser.close()
})

async function dragBox(page: Page) {
  const dragEl = page.locator('.c-drag').first()
  const lastDragEl = dragEl.locator('p:last-child').last()

  expect(dragEl).not.toBeNull()
  expect(lastDragEl).not.toBeNull()
  if (!dragEl || !lastDragEl)
    return {}

  const dragElBoundingBox = await dragEl.boundingBox()
  const previousLastDragElBoundingBox = await lastDragEl.boundingBox()

  expect(dragElBoundingBox).not.toBeNull()
  expect(previousLastDragElBoundingBox).not.toBeNull()
  if (!dragElBoundingBox || !previousLastDragElBoundingBox)
    return {}

  await page.mouse.move(
    dragElBoundingBox.x + dragElBoundingBox.width / 2,
    dragElBoundingBox.y + dragElBoundingBox.height / 4,
  )
  await page.mouse.down()
  await page.mouse.move(
    dragElBoundingBox.x + dragElBoundingBox.width / 2,
    dragElBoundingBox.y + dragElBoundingBox.height / 4 * 3,
    {
      steps: 50,
    },
  )
  await page.mouse.up()

  return { lastDragEl, previousLastDragElBoundingBox }
}

describe.concurrent('drag', async () => {
  it('events', async () => {
    const events = ['c.drag.start', 'c.drag.end']
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:4173/drag.html')

    await page.evaluate(() => {
      const el = document.querySelector('.c-drag')
      if (!el)
        return
      ['c.drag.start', 'c.drag.end'].forEach((e) => {
        el.addEventListener(e, () => {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      })
    })

    const startEvent = page.waitForEvent('console', msg => msg.text().includes('c.drag.start'))
    const endEvent = page.waitForEvent('console', msg => msg.text().includes('c.drag.end'))

    await dragBox(page)

    const result = (await Promise.all([
      startEvent,
      endEvent,
    ])).map(item => item.text())

    events.forEach(e => expect(result).toContain(e))
  })

  // mouse drag doesn't work with playwright
  it.skip('mouse drag', async () => {
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:4173/drag.html')
    const { lastDragEl, previousLastDragElBoundingBox } = await dragBox(page)
    // await page.pause()

    if (!lastDragEl || !previousLastDragElBoundingBox)
      return

    const currentLastDragElBoundingBox = await lastDragEl.boundingBox()
    expect(currentLastDragElBoundingBox).not.toBeNull()
    expect(currentLastDragElBoundingBox).not.toEqual(previousLastDragElBoundingBox)
  })
})
