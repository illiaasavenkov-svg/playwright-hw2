import { test, expect } from '@playwright/test';

const uniqueEmail = () => `illiasav-${Date.now()}-${Math.random()}@example.com`;

const username = `illiaSav-${Date.now()}`;
const email = `illiaSav-${Date.now()}-${Math.random()}@example.com`;

test.describe('Registration', { tag: '@auth' }, () => {
  test('користувач реєструється з валідними даними', async ({ page }) => {
    await page.goto('http://104.168.59.50/articles');
    await page.getByTestId('nav-sign-up').click();

    await page.getByTestId('auth-username').fill(username);
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill('Tester1!');
    await page.getByTestId('register-confirm-password').fill('Tester1!');
    await page.getByText('Social media').click();
    await page.getByTestId('register-source-social').check();
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-profile')).toMatchAriaSnapshot(`
      - link "${username}":
        - /url: /articles/profile/${username}
    `);
  });
});


test.describe('Registration-exists', { tag: '@auth' }, () => {
  test('Реєстрація з уже використаним email', async ({ page }) => {
await page.goto('http://104.168.59.50/articles');
await page.getByTestId('nav-sign-up').click();;
await page.getByTestId('auth-username').fill('illia Sav');
await page.getByTestId('auth-email').fill('illiasav@gmail.com');
await page.getByTestId('auth-password').fill('Tester1!');
await page.getByTestId('register-confirm-password').fill('Tester1!');
await page.getByTestId('register-terms').check();
await page.getByTestId('auth-submit').click();
await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(`- paragraph: body email або username вже зайняті`);
  });
});


test.describe('Registration-invalid', { tag: '@auth' }, () => {
  test('Реєстрація з невалідними або порожніми даними', async ({ page }) => {
await page.goto('http://104.168.59.50/articles');
await page.getByTestId('nav-sign-up').click();;
await page.getByTestId('auth-username').fill('illia Sav');
await page.getByTestId('auth-email').fill(' ');
await page.getByTestId('auth-password').fill('Tester1!');
await page.getByTestId('register-confirm-password').fill('Tester1!');
await page.getByTestId('register-terms').check();
await page.getByTestId('auth-submit').click();
await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(`- paragraph: email некоректний email`);
  });
});

test.describe('Login', { tag: '@auth' }, () => {
  test('користувач входить з валідними даними', async ({ page }) => {
    // Arrange: існуючий користувач illiasav@gmail.com
    // Act
    await page.goto('http://104.168.59.50/articles');
    await page.getByTestId('nav-sign-in').click();
    await page.getByTestId('auth-email').fill('illiasav@gmail.com');
    await page.getByTestId('auth-password').fill('Tester1!');
    await page.getByTestId('auth-submit').click();

    // Assert
    await expect(page.getByTestId('nav-profile')).toMatchAriaSnapshot(`
      - link "illia Sav":
        - /url: /articles/profile/illia Sav
    `);
  });
});


test.describe('Login-invalid-password', { tag: '@auth' }, () => {
  test('користувач не входить з інвалідними даними', async ({ page }) => {
  await page.goto('http://104.168.59.50/articles');
  await page.getByTestId('nav-sign-in').click();
  await page.getByTestId('auth-email').fill('illia.sav@gmailcom');
  await page.getByTestId('auth-password').fill('Tester1');
  await page.getByTestId('auth-submit').click();
  await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(`- paragraph: email or password неправильні`);
  });
});


test.describe('Login-invalid-user', { tag: '@auth' }, () => {
  test('Вхід неіснуючого користувача', async ({ page }) => {
  await page.goto('http://104.168.59.50/articles');
  await page.getByTestId('nav-sign-in').click();
  await page.getByTestId('auth-email').fill('illia.sav@gmailcom');
  await page.getByTestId('auth-password').fill('Tester1!');
  await page.getByTestId('auth-submit').click();
  await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(`- paragraph: email or password неправильні`);
  });
});