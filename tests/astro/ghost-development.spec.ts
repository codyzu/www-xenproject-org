import process from 'node:process';
import {expect, test} from '@playwright/test';
import {ghostPosts} from './fixtures/ghost-posts';

test.describe('local Ghost development integration', () => {
  test.skip(process.env.GHOST_DEV_TEST !== '1', 'Run with npm run test:astro:dev:ghost');

  test('uses the checked-in fixture without contacting production', async ({page}) => {
    const productionRequests: string[] = [];
    page.on('request', request => {
      if (request.url().startsWith('https://xenproject.org/blog/ghost/')) productionRequests.push(request.url());
    });

    const ghostRequest = page.waitForRequest(request => request.url().includes('/blog/ghost/api/content/posts/'));
    await page.goto('/');
    const request = await ghostRequest;

    const latestNews = page.locator('[data-latest-news]');
    await expect(latestNews).toHaveAttribute('data-ghost-mode', 'mock');
    await expect(latestNews).toHaveAttribute('data-latest-news-state', 'ready');
    await expect(latestNews.locator('.card--news')).toHaveCount(ghostPosts.length);

    const requestUrl = new URL(request.url());
    expect(requestUrl.origin).toBe('http://127.0.0.1:4322');
    expect(requestUrl.searchParams.get('key')).toBe('local-mock');
    expect(productionRequests).toEqual([]);
  });
});
