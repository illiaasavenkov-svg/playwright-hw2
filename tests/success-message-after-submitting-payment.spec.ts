import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('should show success message after submitting payment details', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test="Cappuccino"]').click();
    await page.locator('[data-test="checkout"]').click();

    await page.getByRole('textbox', { name: 'Name' }).fill('Illia');
    await page.getByRole('textbox', { name: 'Email' }).fill('illia@gmail.com');
    await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (0)');
  });
});
