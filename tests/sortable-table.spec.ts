import { test, expect, Page } from '@playwright/test';

declare const process: {
  env: Record<string, string | undefined>;
};

// QA Dojo URL is configured via BASE_URL env variable (fallback for local runs)
test.use({ baseURL: process.env.BASE_URL ?? 'http://104.168.59.50' });

// All locators in this file are XPath only
const SECTION = '//section[.//h2[normalize-space()="Sortable table"]]';
const TABLE = `${SECTION}//table[@data-testid="interactions-table"]`;
const SELECTED_COUNT = `${SECTION}//span[@data-testid="interactions-selected-count"]`;
const ROWS = `${TABLE}/tbody/tr`;
const NAME_CELLS = `${ROWS}/td[2]`;
const STATUS_CELLS = `${ROWS}/td[3]`;
const DURATION_CELLS = `${ROWS}/td[4]`;

const sortButton = (column: string) => `${TABLE}/thead//th//button[contains(normalize-space(), "${column}")]`;
const headerCell = (column: string) => `${TABLE}/thead//th[.//button[contains(normalize-space(), "${column}")]]`;
const rowCheckbox = (name: string) => `${ROWS}[td[2][normalize-space()="${name}"]]//input[@type="checkbox"]`;
const rowByName = (name: string) => `${ROWS}[td[2][normalize-space()="${name}"]]`;

const NAMES_ASC = ['Авторизація', 'Завантаження файлу', 'Пошук за тегом', 'Створення статті'];

const cellTexts = (page: Page, xpath: string) => page.locator(`xpath=${xpath}`);

test.describe('Sortable table', { tag: '@interactions' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/laboratory/interactions/');
    await expect(page.locator(`xpath=${TABLE}`)).toBeVisible();
  });

  test.describe('Вибір рядків', () => {
    test('лічильник "Вибрано" збільшується при виборі кожного рядка', async ({ page }) => {
      const counter = page.locator(`xpath=${SELECTED_COUNT}`);
      await expect(counter).toHaveText('Вибрано: 0');

      for (const [index, name] of NAMES_ASC.entries()) {
        const checkbox = page.locator(`xpath=${rowCheckbox(name)}`);
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        await expect(counter).toHaveText(`Вибрано: ${index + 1}`);
      }
    });

    test('зняття чекбокса зменшує лічильник "Вибрано"', async ({ page }) => {
      const counter = page.locator(`xpath=${SELECTED_COUNT}`);
      const first = page.locator(`xpath=${rowCheckbox('Авторизація')}`);
      const second = page.locator(`xpath=${rowCheckbox('Пошук за тегом')}`);

      await first.check();
      await second.check();
      await expect(counter).toHaveText('Вибрано: 2');

      await first.uncheck();
      await expect(first).not.toBeChecked();
      await expect(counter).toHaveText('Вибрано: 1');

      await second.uncheck();
      await expect(counter).toHaveText('Вибрано: 0');
    });

    test('вибраний рядок підсвічується', async ({ page }) => {
      const row = page.locator(`xpath=${rowByName('Створення статті')}`);
      await expect(row).not.toHaveClass(/bg-brand-50/);

      await page.locator(`xpath=${rowCheckbox('Створення статті')}`).check();
      await expect(row).toHaveClass(/bg-brand-50/);
    });

    test('вибір рядків зберігається після сортування', async ({ page }) => {
      await page.locator(`xpath=${rowCheckbox('Авторизація')}`).check();
      await page.locator(`xpath=${rowCheckbox('Створення статті')}`).check();
      await expect(page.locator(`xpath=${SELECTED_COUNT}`)).toHaveText('Вибрано: 2');

      await page.locator(`xpath=${sortButton('Тривалість')}`).click();

      await expect(page.locator(`xpath=${SELECTED_COUNT}`)).toHaveText('Вибрано: 2');
      await expect(page.locator(`xpath=${rowCheckbox('Авторизація')}`)).toBeChecked();
      await expect(page.locator(`xpath=${rowCheckbox('Створення статті')}`)).toBeChecked();
      await expect(page.locator(`xpath=${rowCheckbox('Пошук за тегом')}`)).not.toBeChecked();
    });
  });

  test.describe('Сортування', () => {
    test('за замовчуванням таблиця відсортована за назвою тесту за зростанням', async ({ page }) => {
      await expect(page.locator(`xpath=${headerCell('Тест')}`)).toHaveAttribute('aria-sort', 'ascending');
      await expect(page.locator(`xpath=${headerCell('Статус')}`)).toHaveAttribute('aria-sort', 'none');
      await expect(page.locator(`xpath=${headerCell('Тривалість')}`)).toHaveAttribute('aria-sort', 'none');
      await expect(cellTexts(page, NAME_CELLS)).toHaveText(NAMES_ASC);
    });

    test('клік по "Тест" перемикає порядок зростання/спадання', async ({ page }) => {
      const header = page.locator(`xpath=${headerCell('Тест')}`);
      const button = page.locator(`xpath=${sortButton('Тест')}`);

      await button.click();
      await expect(header).toHaveAttribute('aria-sort', 'descending');
      await expect(button).toContainText('↓');
      await expect(cellTexts(page, NAME_CELLS)).toHaveText([...NAMES_ASC].reverse());

      await button.click();
      await expect(header).toHaveAttribute('aria-sort', 'ascending');
      await expect(button).toContainText('↑');
      await expect(cellTexts(page, NAME_CELLS)).toHaveText(NAMES_ASC);
    });

    test('сортування за статусом за зростанням і спаданням', async ({ page }) => {
      const button = page.locator(`xpath=${sortButton('Статус')}`);

      await button.click();
      await expect(page.locator(`xpath=${headerCell('Статус')}`)).toHaveAttribute('aria-sort', 'ascending');
      await expect(page.locator(`xpath=${headerCell('Тест')}`)).toHaveAttribute('aria-sort', 'none');
      await expect(cellTexts(page, STATUS_CELLS)).toHaveText(['Failed', 'Passed', 'Passed', 'Skipped']);

      await button.click();
      await expect(page.locator(`xpath=${headerCell('Статус')}`)).toHaveAttribute('aria-sort', 'descending');
      await expect(cellTexts(page, STATUS_CELLS)).toHaveText(['Skipped', 'Passed', 'Passed', 'Failed']);
    });

    test('сортування за тривалістю за зростанням і спаданням', async ({ page }) => {
      const button = page.locator(`xpath=${sortButton('Тривалість')}`);

      await button.click();
      await expect(page.locator(`xpath=${headerCell('Тривалість')}`)).toHaveAttribute('aria-sort', 'ascending');
      await expect(cellTexts(page, DURATION_CELLS)).toHaveText(['0.0 s', '5.7 s', '8.4 s', '12.1 s']);
      await expect(cellTexts(page, NAME_CELLS)).toHaveText([
        'Завантаження файлу',
        'Пошук за тегом',
        'Авторизація',
        'Створення статті',
      ]);

      await button.click();
      await expect(page.locator(`xpath=${headerCell('Тривалість')}`)).toHaveAttribute('aria-sort', 'descending');
      await expect(cellTexts(page, DURATION_CELLS)).toHaveText(['12.1 s', '8.4 s', '5.7 s', '0.0 s']);
    });

    test('рядок переміщується разом з усіма своїми клітинками', async ({ page }) => {
      await page.locator(`xpath=${sortButton('Тривалість')}`).click();

      const lastRow = page.locator(`xpath=(${ROWS})[last()]`);
      await expect(lastRow.locator('xpath=./td[2]')).toHaveText('Створення статті');
      await expect(lastRow.locator('xpath=./td[3]')).toHaveText('Failed');
      await expect(lastRow.locator('xpath=./td[4]')).toHaveText('12.1 s');
    });
  });
});
