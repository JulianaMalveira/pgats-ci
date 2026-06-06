// @ts-check
import { test, expect } from '@playwright/test';

test.describe('user rides', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://cdn.jsdelivr.net/**', (route) => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('user should be able to ride', async ({ page }) => {
    await page.getByRole('link', { name: 'Choose Roba Swings' }).click();
    await page.getByLabel('Amount of people').selectOption('2');

    await Promise.all([
      page.waitForURL(/success/),
      page.getByRole('button', { name: 'Next' }).click(),
    ]);

    await expect(page).toHaveURL(/success/);
  });

  test('user above height should not be allowed', async ({ page }) => {
    await page
      .getByRole('link', { name: 'Choose Robo Coaster Of Doom' })
      .click();

    await page.getByLabel('Amount of people').selectOption('1');

    await page.getByLabel('Height for person').fill('139');

    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByText(/too short/i)).toBeVisible();
  });

  test('user with minimum height should be allowed', async ({ page }) => {
    await page
      .getByRole('link', { name: 'Choose Robo Coaster Of Doom' })
      .click();

    await page.getByLabel('Amount of people').selectOption('1');

    await page.getByLabel('Height for person').fill('141');

    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByText(/1 person/i)).toBeVisible();
  });
});
