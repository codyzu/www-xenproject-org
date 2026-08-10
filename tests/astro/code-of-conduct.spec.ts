import {expect, test} from '@playwright/test';

test.describe('Astro spike code of conduct page', () => {
  test('renders the MDX content page shell', async ({page}) => {
    await page.goto('/contribute/code-of-conduct/');

    await expect(page).toHaveTitle(/Xen Project Code of Conduct/i);
    await expect(page.getByRole('heading', {level: 1, name: /Xen Project Code of Conduct/i})).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: /Our Pledge/i})).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    await page.evaluate(async () => document.fonts.ready);

    await expect(page).toHaveScreenshot('code-of-conduct-page.png', {
      fullPage: true,
    });
  });
});
