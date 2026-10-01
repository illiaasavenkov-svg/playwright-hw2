import { test, expect } from '@playwright/test';

test('coffee_cart', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Espresso"]').click();
  await expect(page.getByRole('link', { name: 'Cart page' })).toMatchAriaSnapshot(`
    - link "Cart page":
      - /url: /cart
      - text: cart (1)
    `);
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await expect(page.locator('#app')).toMatchAriaSnapshot(`
    - listitem:
      - link "Cart page":
        - /url: /cart
        - text: cart (2)
    `);
});