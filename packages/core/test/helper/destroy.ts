import type { Page } from 'playwright'

export async function destroyComponent(page: Page) {
  const before = await page.content()
  const destroyBtn = page.locator('.js-destroy').first()
  await destroyBtn.click()
  const after = await page.content()

  return { after, before }
}
