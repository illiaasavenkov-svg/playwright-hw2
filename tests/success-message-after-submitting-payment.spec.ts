import { test, expect } from '@playwright/test';

test('purchase', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('[data-test="checkout"]').click();

  await page.getByRole('textbox', { name: 'Name' }).fill('Illia');
  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Illia');

  await page.getByRole('textbox', { name: 'Email' }).fill('illia@gmail.com');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('illia@gmail.com');
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.locator('#app')).toMatchAriaSnapshot(`- button "Thanks for your purchase. Please check your email for payment."`);
});