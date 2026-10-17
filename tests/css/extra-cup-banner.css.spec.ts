import { test, expect } from '@playwright/test';

test.describe('Extra cup promotion (CSS selectors)', () => {
  test('should offer discounted Mocha after 3 coffees and add it to the cart', async ({ page }) => {
    await page.goto('/');

    const cartLink = page.locator('a[href="/cart"]');

    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[data-test="Cappuccino"]').click();
    await page.locator('[data-test="Americano"]').click();

    await expect(page.locator('.promo span')).toHaveText("It's your lucky day! Get an extra cup of Mocha for $4.");
    await page.locator('.promo .yes').click();

    await expect(cartLink).toHaveText('cart (4)');

    await cartLink.click();

    await expect(
      page.locator('.list-item:has(.delete[aria-label="Remove all (Discounted) Mocha"])'),
    ).toContainText('(Discounted) Mocha');
    await expect(page.locator('.pay')).toHaveText('Total: $42.00');
  });
});
