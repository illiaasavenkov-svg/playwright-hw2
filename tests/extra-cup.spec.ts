import { test, expect } from '@playwright/test';

test('extra cup', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');

  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('[data-test="Americano"]').click();

  await expect(page.getByText('It\'s your lucky day! Get an extra cup of Mocha for $4.espressochocolate')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, of course!' }).click();

  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect(page.getByText('(Discounted) Mocha$4.00 x 1')).toBeVisible();
  await expect(page.getByText('Americano$7.00 x 1+-$7.00x')).toBeVisible();
  await expect(page.getByText('Cappuccino$19.00 x 1+-$19.00x')).toBeVisible();
  await expect(page.getByText('Espresso Macchiato$12.00 x 1')).toBeVisible();

  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('illia');
  await page.getByRole('textbox', { name: 'Email' }).fill('illia@gmail.com');
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByRole('button', { name: 'Thanks for your purchase.' })).toBeVisible();
});