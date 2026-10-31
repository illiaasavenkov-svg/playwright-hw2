import type { Page } from '@playwright/test';

export async function addCoffeesToCart(page: Page, coffees: string[]) {
  for (const coffee of coffees) {
    await page.locator(`[data-test="${coffee}"]`).click();
  }
}

export async function openPaymentForm(page: Page, coffee: string) {
  await addCoffeesToCart(page, [coffee]);
  await page.locator('[data-test="checkout"]').click();
}

export async function fillPaymentForm(page: Page, name: string, email: string) {
  await page.getByRole('textbox', { name: 'Name' }).fill(name);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
}

export async function submitPaymentWithPromotion(page: Page) {
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
}

export async function acceptExtraCupOffer(page: Page) {
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
}

export async function openCartPage(page: Page) {
  await page.getByRole('link', { name: 'Cart page' }).click();
}
