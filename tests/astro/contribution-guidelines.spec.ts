import {expect, test} from '@playwright/test';

test.describe('Astro spike contribution guidelines page', () => {
  test('renders the MDX content page shell', async ({page}) => {
    await page.goto('/contribute/contribution-guidelines/');

    await expect(page).toHaveTitle(/Contribution guidelines/i);
    await expect(page.getByRole('heading', {level: 1, name: /Contribution guidelines/i})).toBeVisible();
    await expect(page.getByRole('heading', {level: 3, name: /Introduction/i})).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    await page.evaluate(async () => document.fonts.ready);

    await expect(page).toHaveScreenshot('contribution-guidelines-page.png', {
      fullPage: true,
    });
  });
});
