import {readFileSync} from 'node:fs';
import {expect, test} from '@playwright/test';

const archive = '/community/xen-devel-digest/';
const draftUrl = `${archive}2026-11-12/`;

test('keeps the unreviewed first digest out of the public artifact', async ({page, request}) => {
  test.skip(!/^draft: true$/m.test(readFileSync('src/content/xen-devel-digests/2026-11-12.md', 'utf8')), 'The first issue has been reviewed and published.');
  expect((await request.get(draftUrl)).status()).toBe(404);
  const feed = await request.get(`${archive}rss.xml`);
  expect(feed.ok()).toBe(true);
  expect(await feed.text()).not.toContain('2026-11-12');
  const sitemap = await request.get('/sitemap-0.xml');
  expect(await sitemap.text()).not.toContain(draftUrl);
  await page.goto(archive);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('This week on xen-devel');
  await expect(page.locator(`a[href="${draftUrl}"]`)).toHaveCount(0);
  if (await page.locator('article h3 a').count() === 0) {
    await expect(page.getByText('The first issue is being prepared. Reviewed issues will appear here when published.')).toBeVisible();
    await page.goto('/');
    await expect(page.locator('#development-updates')).toHaveCount(0);
  }
});

test('connects community and developer resources to the digest archive', async ({page}) => {
  for (const path of ['/community/', '/contribute/get-started/', '/resources/mailing-lists/']) {
    await page.goto(path);
    await expect(page.locator(`main a[href="${archive}"]`).first()).toBeVisible();
  }
});

test('keeps the archive readable at mobile and desktop widths', async ({page}) => {
  for (const width of [390, 834, 1440]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto(archive);
    await expect(page.getByRole('link', {name: 'Subscribe via RSS', exact: true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
  }
});
