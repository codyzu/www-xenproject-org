import type {Page} from '@playwright/test';

export const ghostPosts = [
  ['Xen Summit community highlights', 'A recap of talks, collaboration, and community updates from the latest Xen Summit.', '2026-06-18T10:00:00.000Z', 'Community'],
  ['Advancing automotive virtualization', 'Project contributors share recent work on safe and flexible automotive systems.', '2026-06-12T09:30:00.000Z', 'Automotive'],
  ['Xen Project security update', 'A summary of recent security process improvements across the Xen ecosystem.', '2026-06-05T08:15:00.000Z', 'Security'],
  ['Meet the Xen Project maintainers', 'Learn how maintainers coordinate releases and welcome new contributors.', '2026-05-29T13:00:00.000Z', 'Community'],
  ['New developments in Xen on Arm', 'An overview of current Arm enablement and performance engineering.', '2026-05-22T11:45:00.000Z', 'Arm'],
].map(([title, excerpt, published_at, tag], index) => ({
  title,
  excerpt,
  published_at,
  url: `/blog/${index + 1}/`,
  tags: [{name: tag, url: `/blog/tag/${tag.toLowerCase()}/`}],
  authors: [{name: 'Xen Project', url: '/blog/author/xen-project/'}],
}));

export async function mockGhostApi(page: Page) {
  await page.route('**/blog/ghost/api/content/posts/**', async route => route.fulfill({json: {posts: ghostPosts}}));
}
