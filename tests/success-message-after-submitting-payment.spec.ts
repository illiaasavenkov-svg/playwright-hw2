import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('should show success message after submitting payment details', async ({ page }) => {
    // Locators depend on the `page` fixture, so they live inside the test.
    // All are const: a locator is never reassigned, it is re-evaluated on each action.
    const cappuccinoCup = page.locator('[data-test="Cappuccino"]');
    const checkoutButton = page.locator('[data-test="checkout"]');
    const nameInput = page.getByRole('textbox', { name: 'Name' });
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    const promotionCheckbox = page.getByRole('checkbox', { name: 'Promotion checkbox' });
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const successMessage = page.getByText('Thanks for your purchase. Please check your email for payment.');
    const cartLink = page.getByRole('link', { name: 'Cart page' });

    await page.goto('/');

    await cappuccinoCup.click();
    await checkoutButton.click();

    await nameInput.fill('Illia');
    await emailInput.fill('illia@gmail.com');
    await promotionCheckbox.check();
    await submitButton.click();

    await expect(successMessage).toBeVisible();
    await expect(cartLink).toHaveText('cart (0)');
  });
});
