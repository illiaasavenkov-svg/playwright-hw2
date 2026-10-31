import { test, expect } from '@playwright/test';

test.describe('Cart page', () => {
  test('should show selected coffees in the cart and remove one of them', async ({ page }) => {
    // Locators depend on the `page` fixture, so they live inside the test.
    // All are const: a locator is never reassigned, it is re-evaluated on each action.
    const espressoMacchiatoCup = page.locator('[data-test="Espresso_Macchiato"]');
    const cappuccinoCup = page.locator('[data-test="Cappuccino"]');
    const cartLink = page.getByRole('link', { name: 'Cart page' });
    const removeAllCappuccinoButton = page.getByRole('button', { name: 'Remove all Cappuccino' });
    const removeAllEspressoMacchiatoButton = page.getByRole('button', { name: 'Remove all Espresso Macchiato' });
    const checkoutButton = page.locator('[data-test="checkout"]');

    await page.goto('/');

    await espressoMacchiatoCup.click();
    await cappuccinoCup.click();
    await expect(cartLink).toHaveText('cart (2)');

    await cartLink.click();

    await expect(removeAllCappuccinoButton).toBeVisible();
    await expect(removeAllEspressoMacchiatoButton).toBeVisible();

    await removeAllCappuccinoButton.click();

    await expect(removeAllCappuccinoButton).toBeHidden();
    await expect(cartLink).toHaveText('cart (1)');
    await expect(checkoutButton).toHaveText('Total: $12.00');
  });
});
