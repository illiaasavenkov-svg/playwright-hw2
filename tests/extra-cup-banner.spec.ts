import { test, expect } from '@playwright/test';

test.describe('Extra cup promotion', () => {
  test('should offer discounted Mocha after 3 coffees and add it to the cart', async ({ page }) => {
    // Locators depend on the `page` fixture, so they live inside the test.
    // All are const: a locator is never reassigned, it is re-evaluated on each action.
    const espressoMacchiatoCup = page.locator('[data-test="Espresso_Macchiato"]');
    const cappuccinoCup = page.locator('[data-test="Cappuccino"]');
    const americanoCup = page.locator('[data-test="Americano"]');
    const promoMessage = page.getByText("It's your lucky day! Get an extra cup of Mocha for $4.");
    const acceptPromoButton = page.getByRole('button', { name: 'Yes, of course!' });
    const cartLink = page.getByRole('link', { name: 'Cart page' });
    const discountedMochaItem = page.getByRole('listitem').filter({ hasText: '(Discounted) Mocha' }).first();
    const checkoutButton = page.locator('[data-test="checkout"]');

    await page.goto('/');

    await espressoMacchiatoCup.click();
    await cappuccinoCup.click();
    await americanoCup.click();

    await expect(promoMessage).toBeVisible();
    await acceptPromoButton.click();

    await expect(cartLink).toHaveText('cart (4)');

    await cartLink.click();

    await expect(discountedMochaItem).toBeVisible();
    await expect(checkoutButton).toHaveText('Total: $42.00');
  });
});
