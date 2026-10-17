import { test, expect } from '@playwright/test';

test.describe('Cart item quantity (CSS selectors)', () => {
  test('should increase and decrease coffee quantity from the cart preview', async ({ page }) => {
    await page.goto('/');

    const total = page.locator('.pay');
    const cartLink = page.locator('a[href="/cart"]');

    await page.locator('[data-test="Cappuccino"]').click();
    await expect(total).toHaveText('Total: $19.00');

    await total.hover();

    await page.locator('.cart-preview button[aria-label="Add one Cappuccino"]').click();
    await expect(total).toHaveText('Total: $38.00');
    await expect(cartLink).toHaveText('cart (2)');

    await page.locator('.cart-preview button[aria-label="Remove one Cappuccino"]').click();
    await expect(total).toHaveText('Total: $19.00');
    await expect(cartLink).toHaveText('cart (1)');
  });
});
