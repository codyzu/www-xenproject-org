import process from 'node:process';
import {expect, test} from '@playwright/test';

test.describe('local Ghost development integration', () => {
  test.skip(process.env.GHOST_DEV_TEST !== '1', 'Run with npm run test:astro:dev:ghost');

  test('does not mount the retired homepage news carousel', async ({page}) => {
    const ghostRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/blog/ghost/api/content/posts/')) ghostRequests.push(request.url());
    });

    await page.goto('/');

    await expect(page.locator('[data-latest-news]')).toHaveCount(0);
    expect(ghostRequests).toEqual([]);
  });
});
