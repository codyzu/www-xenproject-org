import {expect, test} from '@playwright/test';

test.describe('Astro spike contact page', () => {
  test('renders the contact page shell', async ({page}) => {
    await page.goto('/about/contact-us/');

    await expect(page).toHaveTitle(/Contact us/i);
    await expect(page.getByRole('heading', {level: 1, name: /Contact us/i})).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    await page.evaluate(async () => document.fonts.ready);

    await expect(page).toHaveScreenshot('contact-us-page.png', {
      fullPage: true,
    });
  });
});
