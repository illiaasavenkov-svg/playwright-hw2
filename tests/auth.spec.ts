import { test, expect } from '@playwright/test';

// QA Dojo URL is configured via BASE_URL env variable (fallback for local runs)
test.use({ baseURL: process.env.BASE_URL ?? 'http://104.168.59.50' });

const PASSWORD = 'Tester1!';
const EXISTING_USER = {
  username: 'illia Sav',
  email: 'illiasav@gmail.com',
};

const uniqueSuffix = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

test.describe('Registration', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles');
    await page.getByTestId('nav-sign-up').click();
  });

  test('користувач реєструється з валідними даними', async ({ page }) => {
    const suffix = uniqueSuffix();
    const username = `illiaSav-${suffix}`;
    const email = `illiasav-${suffix}@example.com`;

    await page.getByTestId('auth-username').fill(username);
    await page.getByTestId('auth-email').fill(email);
    await page.getByTestId('auth-password').fill(PASSWORD);
    await page.getByTestId('register-confirm-password').fill(PASSWORD);
    await page.getByText('Social media').click();
    await expect(page.getByTestId('register-source-social')).toBeChecked();
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-profile')).toMatchAriaSnapshot(`
      - link "${username}":
        - /url: /articles/profile/${username}
    `);
  });

  test('реєстрація з уже використаним email показує помилку', async ({ page }) => {
    await page.getByTestId('auth-username').fill(EXISTING_USER.username);
    await page.getByTestId('auth-email').fill(EXISTING_USER.email);
    await page.getByTestId('auth-password').fill(PASSWORD);
    await page.getByTestId('register-confirm-password').fill(PASSWORD);
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(
      `- paragraph: body email або username вже зайняті`,
    );
  });

  test('реєстрація з порожнім email показує помилку валідації', async ({ page }) => {
    await page.getByTestId('auth-username').fill(`illiaSav-${uniqueSuffix()}`);
    // email field is left empty: server-side validation must reject it
    await page.getByTestId('auth-password').fill(PASSWORD);
    await page.getByTestId('register-confirm-password').fill(PASSWORD);
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(
      `- paragraph: email некоректний email`,
    );
  });
});

test.describe('Login', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles');
    await page.getByTestId('nav-sign-in').click();
  });

  test('користувач входить з валідними даними', async ({ page }) => {
    await page.getByTestId('auth-email').fill(EXISTING_USER.email);
    await page.getByTestId('auth-password').fill(PASSWORD);
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-profile')).toMatchAriaSnapshot(`
      - link "${EXISTING_USER.username}":
        - /url: /articles/profile/${EXISTING_USER.username}
    `);
  });

  test('існуючий користувач не входить з неправильним паролем', async ({ page }) => {
    await page.getByTestId('auth-email').fill(EXISTING_USER.email);
    await page.getByTestId('auth-password').fill('WrongPass1!');
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(
      `- paragraph: email or password неправильні`,
    );
    await expect(page.getByTestId('nav-profile')).toBeHidden();
  });

  test('неіснуючий користувач не може увійти', async ({ page }) => {
    await page.getByTestId('auth-email').fill(`no-such-user-${uniqueSuffix()}@example.com`);
    await page.getByTestId('auth-password').fill(PASSWORD);
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages').getByRole('paragraph')).toMatchAriaSnapshot(
      `- paragraph: email or password неправильні`,
    );
    await expect(page.getByTestId('nav-profile')).toBeHidden();
  });
});
