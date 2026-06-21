import process from 'node:process';
import {expect, test} from '@playwright/test';

test.describe('production Ghost integration', () => {
  test.skip(process.env.GHOST_LIVE_TEST !== '1', 'Run with npm run test:astro:staging:ghost');

  test('loads production posts on staging', async ({page}) => {
    const ghostResponse = page.waitForResponse(response => (
      response.url().startsWith('https://xenproject.org/blog/ghost/api/content/posts/')
    ));

    await page.goto('/');
    const response = await ghostResponse;
    expect(response.ok()).toBeTruthy();

    const latestNews = page.locator('[data-latest-news]');
    await expect(latestNews).toHaveAttribute('data-ghost-mode', 'live');
    await expect(latestNews).toHaveAttribute('data-latest-news-state', 'ready');
    await expect(latestNews.locator('.card--news')).not.toHaveCount(0);
    await expect(latestNews.getByText('Latest news is temporarily unavailable.')).toBeHidden();
  });
});
