import { test, expect } from '@playwright/test';

test.describe('Checkout (CSS selectors)', () => {
  test('should show success message after submitting payment details', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test="Cappuccino"]').click();
    await page.locator('.pay').click();

    await page.locator('#name').fill('Illia');
    await page.locator('#email').fill('illia@gmail.com');
    await page.locator('#promotion').check();
    await page.locator('#submit-payment').click();

    await expect(page.locator('.snackbar.success')).toHaveText(
      'Thanks for your purchase. Please check your email for payment.',
    );
    await expect(page.locator('a[href="/cart"]')).toHaveText('cart (0)');
  });
});
