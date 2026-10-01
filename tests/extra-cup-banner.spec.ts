import { test, expect } from '@playwright/test';

test.describe('Coffee Cart – extra cup promo', () => {
  test('should offer discounted Mocha after 3 coffees and add it to the cart', async ({ page }) => {
    await page.goto('https://coffee-cart.app/');

    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[data-test="Cappuccino"]').click();
    await page.locator('[data-test="Americano"]').click();

    await expect(page.getByText("It's your lucky day! Get an extra cup of Mocha for $4.")).toBeVisible();
    await page.getByRole('button', { name: 'Yes, of course!' }).click();

    await page.getByRole('link', { name: 'Cart page' }).click();
  });
});