import {expect, test} from '@playwright/test';

const viewports = [
  {name: 'desktop', width: 1440, height: 1000},
  {name: 'iPad portrait', width: 834, height: 1194},
  {name: 'narrow mobile', width: 390, height: 844},
] as const;

test.describe('homepage latest project momentum', () => {
  for (const viewport of viewports) {
    test(`stays compact and overflow-free at ${viewport.name}`, async ({page}) => {
      const ghostRequests: string[] = [];
      page.on('request', (request) => {
        if (request.url().includes('/ghost/api/content/')) ghostRequests.push(request.url());
      });
      await page.setViewportSize({width: viewport.width, height: viewport.height});
      await page.goto('/');

      const latest = page.locator('#latest');
      await expect(latest).toBeVisible();
      await expect(latest.locator('article')).toHaveCount(3);
      await expect(latest.getByRole('link', {name: 'View all news'})).toBeVisible();
      const panda = latest.locator('img');
      await expect(panda).toHaveAttribute('alt', '');
      await panda.scrollIntoViewIfNeeded();
      await expect.poll(() => panda.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);

      const layout = await latest.evaluate((element) => ({
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        sectionWidth: element.getBoundingClientRect().width,
        viewportWidth: window.innerWidth,
      }));
      expect(layout.pageOverflow).toBe(0);
      expect(layout.sectionWidth).toBeLessThanOrEqual(layout.viewportWidth);
      expect(ghostRequests).toEqual([]);
    });
  }

  test('reserves one consistent lane for an optional deterministic badge', async ({page}) => {
    await page.goto('/');
    const cards = page.locator('#latest article');
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      const lane = card.locator('[data-news-badge-lane]');
      await expect(lane).toHaveCount(1);
      await expect.poll(() => lane.evaluate((element) => element.getBoundingClientRect().height)).toBe(28);
      const badges = card.locator('span.uno-rounded-full, strong.uno-rounded-full');
      expect(await badges.count()).toBeLessThanOrEqual(1);
      if (await badges.count()) {
        await expect(badges.locator('[aria-hidden="true"]')).toHaveCount(1);
        await expect(badges).toHaveText(/\S/);
      }
    }
    const titleOffsets = await cards.evaluateAll((articles) =>
      articles.map((article) => {
        const heading = article.querySelector('h3');
        return (heading?.getBoundingClientRect().top ?? 0) - article.getBoundingClientRect().top;
      }),
    );
    expect(Math.max(...titleOffsets) - Math.min(...titleOffsets)).toBeLessThan(0.5);
  });

  test('keeps the legacy About news presentation on the shared server-side cache', async ({page}) => {
    const ghostRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/ghost/api/content/')) ghostRequests.push(request.url());
    });
    await page.goto('/about/');

    const latest = page.locator('[data-latest-news]');
    await expect(latest).toBeVisible();
    await expect(latest.locator('article:not(.carousel-item--clone)')).toHaveCount(5);
    await expect(latest).not.toHaveAttribute('data-ghost-content-api-key');
    await expect(latest).not.toHaveAttribute('data-ghost-api-url');
    expect(ghostRequests).toEqual([]);
  });
});
