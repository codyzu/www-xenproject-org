import {expect, type Page, test} from '@playwright/test';
import {projects} from '../../src/data/projects.ts';
import {ghostPosts, mockGhostApi} from './fixtures/ghost-posts';

const homepageProjects = projects.filter((project) => project.route !== '/projects/hypervisor/openpgp-keys/');

async function prepareHomepage(page: Page, {mockNews = true} = {}) {
  if (mockNews) await mockGhostApi(page);
  await page.goto('/');
  await page.evaluate(async () => document.fonts.ready);
  await page.addStyleTag({content: '[data-story-star] { visibility: hidden !important; }'});
  await page.evaluate(() => {
    for (const element of document.querySelectorAll('[data-animate]')) element.classList.add('animate');
  });
}

test.describe('homepage below the Story', () => {
  test('renders shared project data and moves one card with its controls', async ({page}) => {
    await prepareHomepage(page);

    const carousel = page.locator('[data-project-carousel]');
    const cards = carousel.locator('.project-carousel-card');
    const rail = carousel.locator('.carousel');
    const previousButton = carousel.getByRole('button', {name: 'Previous projects'});
    const nextButton = carousel.getByRole('button', {name: 'Next projects'});

    await expect(cards).toHaveCount(homepageProjects.length);
    await expect(cards.locator('.card__label')).toHaveText(homepageProjects.map((project) => project.title));
    await expect(carousel.locator('.carousel-item--clone')).toHaveCount(2);
    await expect(previousButton).toBeDisabled();
    await expect(nextButton).toBeEnabled();

    const initialScroll = await rail.evaluate((element) => element.scrollLeft);
    await nextButton.click();
    await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll);
    await expect(previousButton).toBeEnabled();
    const advancedScroll = await rail.evaluate((element) => element.scrollLeft);
    await previousButton.click();
    await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeLessThan(advancedScroll);
    await expect(previousButton).toBeDisabled();

    await rail.evaluate(element => element.scrollTo({left: element.scrollWidth, behavior: 'instant'}));
    await expect(nextButton).toBeDisabled();
  });

  test('renders mocked Ghost posts and moves the news carousel', async ({page}) => {
    await prepareHomepage(page);

    const latestNews = page.locator('[data-latest-news]');
    const cards = latestNews.locator('.card--news');
    const rail = latestNews.locator('.carousel');
    const previousButton = latestNews.getByRole('button', {name: 'Previous news'});
    const nextButton = latestNews.getByRole('button', {name: 'Next news'});

    await expect(latestNews).toHaveAttribute('data-latest-news-state', 'ready');
    await expect(latestNews).toHaveAttribute('aria-busy', 'false');
    await expect(cards).toHaveCount(ghostPosts.length);
    await expect(cards.locator('.card__label')).toHaveText(ghostPosts.map(post => post.title));
    await expect(cards.locator('.card__date')).toHaveText(ghostPosts.map(post => post.published_at.slice(0, 10)));
    await expect(cards.locator('.card__author')).toHaveText(ghostPosts.map(() => 'by Xen Project'));
    await expect(cards.first().getByRole('link', {name: /Read more/})).toHaveAttribute('href', ghostPosts[0].url);
    await expect(previousButton).toBeDisabled();
    await expect(nextButton).toBeEnabled();

    const initialScroll = await rail.evaluate((element) => element.scrollLeft);
    await nextButton.click();
    await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll);
    await expect(previousButton).toBeEnabled();
    const advancedScroll = await rail.evaluate((element) => element.scrollLeft);
    await previousButton.click();
    await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeLessThan(advancedScroll);
    await expect(previousButton).toBeDisabled();
  });

  test('uses production Ghost configuration in the production artifact', async ({page}) => {
    let requestedUrl = '';
    await page.route('https://xenproject.org/blog/ghost/api/content/posts/**', async route => {
      requestedUrl = route.request().url();
      await route.fulfill({json: {posts: ghostPosts}});
    });

    await page.goto('/');
    await expect(page.locator('[data-latest-news]')).toHaveAttribute('data-latest-news-state', 'ready');

    const url = new URL(requestedUrl);
    expect(url.origin).toBe('https://xenproject.org');
    expect(url.pathname).toBe('/blog/ghost/api/content/posts/');
    expect(url.searchParams.get('key')).toBe('b047d7f627a90f40798d11dcba');
    expect(url.searchParams.get('limit')).toBe('10');
    expect(url.searchParams.get('include')).toBe('tags,authors');
  });

  test('keeps news busy until Ghost responds', async ({page}) => {
    let releaseResponse: (() => void) | undefined;
    const responseGate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    await page.route('**/blog/ghost/api/content/posts/**', async route => {
      await responseGate;
      await route.fulfill({json: {posts: ghostPosts}});
    });

    await page.goto('/');
    const latestNews = page.locator('[data-latest-news]');
    await expect(latestNews).toHaveAttribute('aria-busy', 'true');
    await expect(latestNews.getByRole('button', {name: 'Previous news'})).toBeDisabled();
    await expect(latestNews.getByRole('button', {name: 'Next news'})).toBeDisabled();

    releaseResponse?.();
    await expect(latestNews).toHaveAttribute('data-latest-news-state', 'ready');
    await expect(latestNews).toHaveAttribute('aria-busy', 'false');
  });

  for (const [name, response] of [
    ['an empty response', {status: 200, json: {posts: []}}],
    ['an invalid payload', {status: 200, json: {unexpected: true}}],
    ['an HTTP failure', {status: 503, json: {errors: [{message: 'Unavailable'}]}}],
  ] as const) {
    test(`shows the unavailable state for ${name}`, async ({page}) => {
      await page.route('**/blog/ghost/api/content/posts/**', async route => route.fulfill(response));
      await page.goto('/');

      const latestNews = page.locator('[data-latest-news]');
      await expect(latestNews).toHaveAttribute('data-latest-news-state', 'error');
      await expect(latestNews).toHaveAttribute('aria-busy', 'false');
      await expect(latestNews.getByText('Latest news is temporarily unavailable.')).toBeVisible();
      await expect(latestNews.getByRole('button', {name: 'Previous news'})).toBeDisabled();
      await expect(latestNews.getByRole('button', {name: 'Next news'})).toBeDisabled();
    });
  }

  test('recalculates carousel visibility and focus after a mobile resize', async ({page}) => {
    await prepareHomepage(page);
    const carousel = page.locator('[data-project-carousel]');
    const cards = carousel.locator('.project-carousel-card');

    await page.setViewportSize({width: 390, height: 844});
    await expect.poll(() => cards.evaluateAll((items) => items.filter(item => !item.classList.contains('carousel-item--hidden')).length)).toBe(1);
    await expect.poll(() => cards.evaluateAll((items) => items.every(item => {
      const hidden = item.classList.contains('carousel-item--hidden');
      return [...item.querySelectorAll('a')].every(link => link.tabIndex === (hidden ? -1 : 0));
    }))).toBeTruthy();

    const nextButton = carousel.getByRole('button', {name: 'Next projects'});
    await nextButton.focus();
    await page.keyboard.press('Enter');
    await expect(carousel.getByRole('button', {name: 'Previous projects'})).toBeEnabled();
  });

  test('matches the complete post-Story content', async ({page}) => {
    await prepareHomepage(page);

    const article = page.locator('[data-story-followup]');
    await page.evaluate(async () => {
      const article = document.querySelector<HTMLElement>('[data-story-followup]');
      if (!article) throw new Error('Homepage article is missing');
      const start = article.offsetTop;
      const end = start + article.offsetHeight;
      for (let position = start; position < end; position += window.innerHeight * 0.75) {
        window.scrollTo(0, position);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
    });
    await expect(article.locator('#logo-wheel img')).not.toHaveCount(0);
    await expect.poll(() => article.locator('img').evaluateAll(images => images.every((image) => (
      (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0
    )))).toBeTruthy();

    await expect(article).toHaveScreenshot('homepage-post-story-content.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('matches the Story-to-content transition', async ({page}) => {
    await prepareHomepage(page);
    await page.evaluate(() => {
      const article = document.querySelector<HTMLElement>('[data-story-followup]');
      if (!article) throw new Error('Homepage article is missing');
      window.scrollTo(0, article.offsetTop - window.innerHeight * 0.65);
    });
    await page.waitForTimeout(100);

    await expect(page).toHaveScreenshot('homepage-story-transition.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.01,
    });
  });
});
