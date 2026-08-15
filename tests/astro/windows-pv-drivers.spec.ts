import {expect, test} from '@playwright/test';

const siteUrl = new URL(process.env.SITE_URL ?? 'https://beta.xenproject.org');

test.describe('Windows PV Drivers page', () => {
  test('keeps the historical route searchable without outdated download promises', async ({page}) => {
    await page.route('https://www.youtube.com/**', (route) => route.abort());
    await page.goto('/projects/windows-pv-drivers/');

    await expect(page.getByRole('heading', {level: 2, name: 'Maintenance status'})).toHaveCount(0);
    await expect(page.getByText('have not been refreshed in a long time')).toHaveCount(0);
    await expect(page.getByText('The team plans to perform regular builds', {exact: false})).toHaveCount(0);
    await expect(page.getByRole('link', {name: 'pvdrivers/win'})).toHaveAttribute('href', 'https://xenbits.xen.org/gitweb/?a=project_list;pf=pvdrivers/win');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    const canonicalUrl = new URL('/projects/windows-pv-drivers/', siteUrl).toString();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl);
    const sitemap = await page.request.get('/sitemap-0.xml');
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain(canonicalUrl);
    await expect(page.getByRole('link', {name: /^Download development builds/})).toHaveCount(0);
    await expect(page.getByRole('heading', {level: 2, name: 'Downloads'}).locator('..')).toHaveScreenshot('windows-pv-drivers-downloads.png');
  });
});
