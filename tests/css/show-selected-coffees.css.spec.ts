import { test, expect } from '@playwright/test';

test.describe('Cart page (CSS selectors)', () => {
  test('should show selected coffees in the cart and remove one of them', async ({ page }) => {
    await page.goto('/');

    const cartLink = page.locator('a[href="/cart"]');
    const removeCappuccino = page.locator('.delete[aria-label="Remove all Cappuccino"]');

    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[data-test="Cappuccino"]').click();
    await expect(cartLink).toHaveText('cart (2)');

    await cartLink.click();

    await expect(removeCappuccino).toBeVisible();
    await expect(page.locator('.delete[aria-label="Remove all Espresso Macchiato"]')).toBeVisible();

    await removeCappuccino.click();

    await expect(removeCappuccino).toBeHidden();
    await expect(cartLink).toHaveText('cart (1)');
    await expect(page.locator('.pay')).toHaveText('Total: $12.00');
  });
});
