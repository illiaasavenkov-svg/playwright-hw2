import { test, expect } from '@playwright/test';
import { openPaymentForm, fillPaymentForm, submitPaymentWithPromotion } from './page-actions';

test.describe('Checkout', () => {
  test('should show success message after submitting payment details', async ({ page }) => {
    await page.goto('/');

    await openPaymentForm(page, 'Cappuccino');
    await fillPaymentForm(page, 'Illia', 'illia@gmail.com');
    await submitPaymentWithPromotion(page);

    await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (0)');
  });
});
