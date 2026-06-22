import {expect, test} from '@playwright/test';

test.describe('Windows PV Drivers page', () => {
  test('keeps each download action in one button', async ({page}) => {
    await page.route('https://www.youtube.com/**', (route) => route.abort());
    await page.goto('/projects/windows-pv-drivers/');

    const downloads = page.getByRole('heading', {level: 2, name: 'Downloads'}).locator('..');
    const developmentBuilds = downloads.getByRole('link', {name: /^Download development builds/});
    const installationWiki = downloads.getByRole('link', {name: /^Read installation driver wiki/});

    await expect(developmentBuilds).toHaveCount(1);
    await expect(installationWiki).toHaveCount(1);
    await expect(developmentBuilds.locator('i')).toHaveCount(1);
    await expect(installationWiki.locator('i')).toHaveCount(1);
    await expect(downloads.locator('.btn p')).toHaveCount(0);
    await expect(downloads).toHaveScreenshot('windows-pv-drivers-downloads.png');
  });
});
