import type { Page } from 'playwright'

export async function destroyComponent(page: Page) {
  const before = await page.locator('body').innerHTML()
  const destroyBtn = page.locator('.js-destroy').first()
  await destroyBtn.click()
  const after = await page.locator('body').innerHTML()

  return { after, before }
}
