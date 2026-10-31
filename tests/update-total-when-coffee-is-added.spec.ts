import { test, expect } from '@playwright/test';

test.describe('Cart total', () => {
  test('should update total price when coffees are added', async ({ page }) => {
    // Locators depend on the `page` fixture, so they live inside the test.
    // All are const: a locator is never reassigned, it is re-evaluated on each action.
    const checkoutButton = page.locator('[data-test="checkout"]');
    const espressoCup = page.locator('[data-test="Espresso"]');
    const espressoMacchiatoCup = page.locator('[data-test="Espresso_Macchiato"]');
    const cartLink = page.getByRole('link', { name: 'Cart page' });

    await page.goto('/');

    await expect(checkoutButton).toHaveText('Total: $0.00');

    await espressoCup.click();
    await expect(checkoutButton).toHaveText('Total: $10.00');
    await expect(cartLink).toHaveText('cart (1)');

    await espressoMacchiatoCup.click();
    await expect(checkoutButton).toHaveText('Total: $22.00');
    await expect(cartLink).toHaveText('cart (2)');
  });
});
