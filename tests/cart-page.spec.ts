import { test, expect } from '@playwright/test';

test('cart_page', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await expect(page.locator('#app')).toMatchAriaSnapshot(`
    - listitem:
      - link "Cart page":
        - /url: /cart
        - text: cart (2)
    `);
  await page.getByRole('link', { name: 'Cart page' }).click();

  await expect(page.getByText('Cappuccino x 1+-Espresso Macchiato x 1+-Total: $')).toBeVisible();
  await page.getByRole('button', { name: 'Remove all Cappuccino' }).click();
  await expect(page.getByText('menucart (1)githubEspresso')).toBeVisible();
});