import { test, expect } from '@playwright/test';
import { addCoffeesToCart, acceptExtraCupOffer, openCartPage } from './page-actions';

test.describe('Extra cup promotion', () => {
  test('should offer discounted Mocha after 3 coffees and add it to the cart', async ({ page }) => {
    await page.goto('/');

    await addCoffeesToCart(page, ['Espresso_Macchiato', 'Cappuccino', 'Americano']);

    await expect(page.getByText("It's your lucky day! Get an extra cup of Mocha for $4.")).toBeVisible();
    await acceptExtraCupOffer(page);

    await expect(page.getByRole('link', { name: 'Cart page' })).toHaveText('cart (4)');

    await openCartPage(page);

    await expect(page.getByRole('listitem').filter({ hasText: '(Discounted) Mocha' }).first()).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toHaveText('Total: $42.00');
  });
});
