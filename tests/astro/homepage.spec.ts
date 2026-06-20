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
    await prepareHomepage(page, {mockNews: false});
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
