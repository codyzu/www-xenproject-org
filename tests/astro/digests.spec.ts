import {expect, test} from '@playwright/test';

const archive = '/community/xen-devel-digest/';

test('shows both imported issues with adjacent navigation and feed entries', async ({page, request}) => {
  await page.goto(archive);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('This week on xen-devel');
  for (const id of ['2026-11-12', '2026-11-08']) {
    await expect(page.locator(`article h3 a[href="${archive}${id}/"]`)).toBeVisible();
    expect((await request.get(`${archive}${id}/`)).ok()).toBe(true);
  }
  const feed = await request.get(`${archive}rss.xml`);
  expect(feed.ok()).toBe(true);
  const xml = await feed.text();
  expect(xml).toContain(`${archive}2026-11-12/`);
  expect(xml).toContain(`${archive}2026-11-08/`);
  await page.goto(`${archive}2026-11-12/`);
  await expect(page.getByRole('navigation', {name: 'Weekly issues'}).getByRole('link')).toHaveAttribute('href', `${archive}2026-11-08/`);
  await expect(page.locator('article')).not.toContainText('Reviewed by');
  await page.goto('/');
  await expect(page.locator('#development-updates')).toBeVisible();
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
    for (const url of [archive, `${archive}2026-11-12/`, `${archive}2026-11-08/`]) {
      await page.goto(url);
      await expect(page.getByRole('link', {name: 'Subscribe via RSS', exact: true})).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
    }
  }
});
