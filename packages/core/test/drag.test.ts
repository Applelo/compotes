import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Browser, Page } from 'playwright'
import { chromium } from 'playwright'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch({
    // headless: false,
  })
})

afterAll(async () => {
  browser.close()
})

async function dragBox(page: Page) {
  const dragEl = page.locator('.c-drag')
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

  // await page.evaluate(() => document.addEventListener('mousemove', (e) => {
  //   const pos = e
  //   const dot = document.createElement('div')
  //   dot.className = 'dot'
  //   dot.style.left = `${pos.x}px`
  //   dot.style.top = `${pos.y}px`
  //   document.body.appendChild(dot)
  // }))

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

    const result = (await Promise.all([startEvent, endEvent])).map(item => item.text())
    expect(result).toContain('c.drag.start')
    expect(result).toContain('c.drag.end')
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