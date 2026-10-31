import { test, expect } from '@playwright/test';

test.describe('Cart item quantity', () => {
  test('should increase and decrease coffee quantity from the cart preview', async ({ page }) => {
    // Locators depend on the `page` fixture, so they live inside the test.
    // All are const: a locator is never reassigned, it is re-evaluated on each action.
    const cappuccinoCup = page.locator('[data-test="Cappuccino"]');
    const checkoutButton = page.locator('[data-test="checkout"]');
    const addOneCappuccinoButton = page.getByRole('button', { name: 'Add one Cappuccino' });
    const removeOneCappuccinoButton = page.getByRole('button', { name: 'Remove one Cappuccino' });
    const cartLink = page.getByRole('link', { name: 'Cart page' });

    await page.goto('/');

    await cappuccinoCup.click();
    await expect(checkoutButton).toHaveText('Total: $19.00');

    await checkoutButton.hover();

    await addOneCappuccinoButton.click();
    await expect(checkoutButton).toHaveText('Total: $38.00');
    await expect(cartLink).toHaveText('cart (2)');

    await removeOneCappuccinoButton.click();
    await expect(checkoutButton).toHaveText('Total: $19.00');
    await expect(cartLink).toHaveText('cart (1)');
  });
});
