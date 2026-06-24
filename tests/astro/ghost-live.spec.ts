import process from 'node:process';
import {expect, test} from '@playwright/test';

test.describe('production Ghost integration', () => {
  test.skip(process.env.GHOST_LIVE_TEST !== '1', 'Run with npm run test:astro:staging:ghost');

  test('does not mount the retired homepage news carousel on staging', async ({page}) => {
    const ghostRequests: string[] = [];
    page.on('request', request => {
      if (request.url().startsWith('https://xenproject.org/blog/ghost/api/content/posts/')) ghostRequests.push(request.url());
    });

    await page.goto('/');

    await expect(page.locator('[data-latest-news]')).toHaveCount(0);
    expect(ghostRequests).toEqual([]);
  });
});
