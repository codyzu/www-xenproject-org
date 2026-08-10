import {expect, test} from '@playwright/test';

test.describe('Astro spike Matrix page', () => {
  test('renders the MDX Matrix resource page', async ({page}) => {
    await page.goto('/resources/matrix/');

    await expect(page).toHaveTitle(/Matrix/i);
    await expect(page.getByRole('heading', {level: 1, name: /Matrix/i})).toBeVisible();
    await expect(page.getByRole('heading', {level: 2, name: /Xen Project Matrix/i})).toBeVisible();
    await expect(page.getByRole('link', {name: /Join/i}).first()).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    await page.evaluate(async () => document.fonts.ready);

    await expect(page).toHaveScreenshot('matrix-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.025,
    });
  });
});
