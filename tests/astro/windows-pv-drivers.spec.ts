import {expect, test} from '@playwright/test';

test.describe('Windows PV Drivers page', () => {
  test('keeps the route searchable while directing readers to the repository listing', async ({page}) => {
    await page.route('https://www.youtube.com/**', (route) => route.abort());
    await page.goto('/projects/windows-pv-drivers/');

    const status = page.getByRole('heading', {level: 2, name: 'Maintenance status'}).locator('..');
    await expect(status).toContainText('have not been refreshed in a long time');
    await expect(status.getByRole('link', {name: /Windows PV repositories on Xenbits/})).toHaveAttribute('href', 'https://xenbits.xen.org/gitweb/?a=project_list;pf=pvdrivers/win');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.getByRole('link', {name: /^Download development builds/})).toHaveCount(0);
    await expect(status).toHaveScreenshot('windows-pv-drivers-status.png');
  });
});
