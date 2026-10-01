import { test, expect } from '@playwright/test';

test.describe('Cart item quantity', () => {
  test('should increase and decrease coffee quantity from the cart preview', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test="Cappuccino"]').click();
    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $19.00');

    await page.locator('[data-test="checkout"]').hover();

    await page.getByRole('button', { name: 'Add one Cappuccino' }).click();
    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $38.00');
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (2)');

    await page.getByRole('button', { name: 'Remove one Cappuccino' }).click();
    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $19.00');
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (1)');
  });
});
