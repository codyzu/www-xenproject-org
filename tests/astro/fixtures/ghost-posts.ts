import {readFileSync} from 'node:fs';
import path from 'node:path';
import type {Page} from '@playwright/test';

const ghostFixture = JSON.parse(readFileSync(path.resolve('data/ghost-posts.fixture.json'), 'utf8')) as {
  posts: unknown[];
};
export const ghostPosts = ghostFixture.posts;

export async function mockGhostApi(page: Page, payload: unknown = {posts: ghostPosts}) {
  await page.route('**/blog/ghost/api/content/posts/**', async route => route.fulfill({json: payload}));
}
