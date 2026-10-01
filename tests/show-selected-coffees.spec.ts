import { test, expect } from '@playwright/test';

test.describe('Cart page', () => {
  test('should show selected coffees in the cart and remove one of them', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test="Espresso_Macchiato"]').click();
    await page.locator('[data-test="Cappuccino"]').click();
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (2)');

    await page.getByRole('link', { name: 'Cart page' }).click();

    await expect(page.getByRole('button', { name: 'Remove all Cappuccino' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove all Espresso Macchiato' })).toBeVisible();

    await page.getByRole('button', { name: 'Remove all Cappuccino' }).click();

    await expect(page.getByRole('button', { name: 'Remove all Cappuccino' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (1)');
    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $12.00');
  });
});
