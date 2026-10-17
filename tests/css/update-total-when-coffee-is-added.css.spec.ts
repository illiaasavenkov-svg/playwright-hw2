import { test, expect } from '@playwright/test';

test.describe('Cart total (CSS selectors)', () => {
  test('should update total price when coffees are added', async ({ page }) => {
    await page.goto('/');

    const total = page.locator('.pay');
    const cartLink = page.locator('a[href="/cart"]');

    await expect(total).toHaveText('Total: $0.00');

    await page.locator('[data-test="Espresso"]').click();
    await expect(total).toHaveText('Total: $10.00');
    await expect(cartLink).toHaveText('cart (1)');

    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await expect(total).toHaveText('Total: $22.00');
    await expect(cartLink).toHaveText('cart (2)');
  });
});
