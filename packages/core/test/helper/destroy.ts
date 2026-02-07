import type { Page } from 'playwright'

export async function destroyComponent(
  page: Page,
): Promise<{ after: string, before: string }> {
  const before = await page.locator('body').innerHTML()
  const destroyBtn = page.locator('.js-destroy').first()
  await destroyBtn.click()
  const after = await page.locator('body').innerHTML()

  return { after, before }
}
