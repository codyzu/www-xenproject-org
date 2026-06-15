import {expect, test} from '@playwright/test';

test.describe('Astro spike Xen Project branding page', () => {
  test('renders the MDX branding page', async ({page}) => {
    await page.goto('/more/xen-branding/');

    await expect(page).toHaveTitle(/Xen Project branding/i);
    await expect(page.getByRole('heading', {level: 1, name: /Xen Project branding/i})).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: /Download/i})).toBeVisible();
    await expect(page.getByRole('link', {name: /Download branding/i})).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: /Usage/i})).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    await page.evaluate(async () => document.fonts.ready);

    await expect(page).toHaveScreenshot('xen-branding-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.025,
    });
  });
});
