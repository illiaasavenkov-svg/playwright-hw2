import { test, expect } from '@playwright/test';

test.describe('Cart total', () => {
  test('should update total price when coffees are added', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $0.00');

    await page.locator('[data-test="Espresso"]').click();
    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $10.00');
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (1)');

    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $22.00');
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (2)');
  });
});
