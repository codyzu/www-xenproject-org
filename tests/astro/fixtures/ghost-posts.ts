import type {Page} from '@playwright/test';
import ghostFixture from '../../../data/ghost-posts.fixture.json';

export const ghostPosts = ghostFixture.posts;

export async function mockGhostApi(page: Page, payload: unknown = {posts: ghostPosts}) {
  await page.route('**/blog/ghost/api/content/posts/**', async route => route.fulfill({json: payload}));
}
