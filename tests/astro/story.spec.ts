import process from 'node:process';
import {expect, type Page, test} from '@playwright/test';
import {mockGhostApi} from './fixtures/ghost-posts';

const scenes = [
  ['intro', 0],
  ['guide', 1],
  ['data-center', 2.5],
  ['automotive', 5.5],
  ['industrial', 8.5],
  ['consumer', 11.5],
  ['finale', 14.2],
] as const;
const snapshotKind = process.env.STORY_SNAPSHOT_KIND === 'hugo' ? 'hugo' : 'current';

// `story-hugo-*.png` snapshots beside this spec preserve the pre-Astro
// implementation at the same scene positions. Active `story-current-*`
// snapshots protect the intentional document-scroll implementation.

async function prepareStory(page: Page) {
  await mockGhostApi(page);
  await page.goto('/');
  await expect(page.locator('#xen-story')).toBeVisible();
  await page.evaluate(async () => document.fonts.ready);
  await page.addStyleTag({content: `
    [data-story-star] { visibility: hidden !important; }
    #xen-story *, #xen-story *::before, #xen-story *::after {
      animation: none !important;
      transition: none !important;
    }
  `});
}

async function scrollStoryTo(page: Page, storyPage: number) {
  await page.evaluate((targetPage) => {
    const story = document.querySelector<HTMLElement>('#xen-story');
    if (!story) throw new Error('Story root is missing');

    const documentStory = story.querySelector<HTMLElement>('[data-story-root]');
    if (documentStory) {
      window.scrollTo(0, documentStory.offsetTop + targetPage * window.innerHeight);
      return;
    }

    const legacyScroller = [...story.querySelectorAll<HTMLElement>('*')]
      .find(element => element.scrollHeight > element.clientHeight && ['auto', 'scroll'].includes(getComputedStyle(element).overflowY));
    if (!legacyScroller) throw new Error('Legacy Story scroller is missing');
    legacyScroller.scrollTop = targetPage * legacyScroller.clientHeight;
    legacyScroller.dispatchEvent(new Event('scroll'));
  }, storyPage);
  await page.waitForTimeout(100);
}

test.describe('homepage Story regression guardrails', () => {
  test('uses document scrolling and leaves the Astro shell in normal DOM order', async ({page}) => {
    await prepareStory(page);

    const structure = await page.evaluate(() => {
      const story = document.querySelector<HTMLElement>('[data-story-root]');
      const viewport = document.querySelector<HTMLElement>('[data-story-viewport]');
      const main = document.querySelector('main');
      const article = main?.querySelector<HTMLElement>('[data-story-followup]');
      const articleStyle = article ? getComputedStyle(article) : undefined;
      return {
        headerCount: document.querySelectorAll('body > header').length,
        articleCount: document.querySelectorAll('main > article').length,
        footerCount: document.querySelectorAll('body > footer').length,
        storyScrollable: story ? story.scrollHeight > story.clientHeight && ['auto', 'scroll'].includes(getComputedStyle(story).overflowY) : true,
        viewportPosition: viewport ? getComputedStyle(viewport).position : '',
        storyBeforeArticle: Boolean(story && main?.querySelector('article') && story.compareDocumentPosition(main.querySelector('article')!) & Node.DOCUMENT_POSITION_FOLLOWING),
        articleGap: story && main?.querySelector<HTMLElement>('article')
          ? main.querySelector<HTMLElement>('article')!.offsetTop - (story.offsetTop + story.offsetHeight)
          : -1,
        articleBridge: Boolean(
          articleStyle
          && articleStyle.backgroundColor !== 'rgba(0, 0, 0, 0)'
          && articleStyle.boxShadow !== 'none'
        ),
      };
    });

    expect(structure).toEqual({
      headerCount: 1,
      articleCount: 1,
      footerCount: 1,
      storyScrollable: false,
      viewportPosition: 'sticky',
      storyBeforeArticle: true,
      articleGap: 0,
      articleBridge: true,
    });

    await scrollStoryTo(page, 15);
    await expect(page.getByText('Where will', {exact: false})).toBeVisible();
    await expect(page.locator('[data-story-transition]')).toHaveCSS('opacity', '1');
    await page.evaluate(() => window.scrollTo(0, document.querySelector<HTMLElement>('main > article')!.offsetTop));
    await expect(page.getByRole('heading', {level: 1, name: /Bring the power of/})).toBeVisible();
  });

  test('paints a persistent non-repeating star field without per-star animation', async ({page}) => {
    await prepareStory(page);
    const fields = page.locator('[data-story-star]');
    await expect(fields).toHaveCount(2);
    const styles = await fields.evaluateAll(elements => elements.map(element => ({
      animationName: getComputedStyle(element).animationName,
    })));
    expect(styles.every(style => style.animationName === 'none')).toBeTruthy();
    const dots = page.locator('[data-star-dot]');
    await expect(dots).toHaveCount(210);
    const positions = await dots.evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element);
      return `${style.left}:${style.top}`;
    }));
    expect(new Set(positions).size).toBe(210);
  });

  test('applies the desktop planet layout constraints', async ({page}) => {
    await prepareStory(page);
    await scrollStoryTo(page, 2.5);

    const scene = page.locator('[data-story-scene="data-center"]');
    await expect(scene).toBeVisible();
    const layout = await scene.evaluate((element) => {
      const foreground = element.firstElementChild as HTMLElement;
      const image = foreground.querySelector('img')!;
      const copy = foreground.querySelector<HTMLElement>('div > div:last-child')!;
      return {
        display: getComputedStyle(foreground).display,
        columns: getComputedStyle(foreground).gridTemplateColumns,
        imageWidth: image.getBoundingClientRect().width,
        copyFontSize: Number.parseFloat(getComputedStyle(copy).fontSize),
        viewportWidth: window.innerWidth,
      };
    });
    expect(layout.display).toBe('grid');
    expect(layout.columns).not.toBe('none');
    expect(layout.imageWidth).toBeLessThan(layout.viewportWidth / 2);
    expect(layout.copyFontSize).toBeGreaterThanOrEqual(24);
  });

  test('keeps the animated guide within its intended bounds', async ({page}) => {
    await prepareStory(page);
    await scrollStoryTo(page, 1);
    const guide = page.locator('[data-story-guide]');
    await expect(guide).toBeVisible();
    await expect(guide).toHaveClass(/uno-animate-bounce/);
    const box = await guide.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(150);
    expect(box!.width).toBeLessThanOrEqual(400);
    expect(box!.height).toBeLessThan(page.viewportSize()!.height * 0.6);
  });

  for (const [name, storyPage] of scenes) {
    test(`matches the approved ${name} scene`, async ({page}) => {
      await prepareStory(page);
      await scrollStoryTo(page, storyPage);
      await expect(page).toHaveScreenshot(`story-${snapshotKind}-${name}.png`, {fullPage: false, maxDiffPixelRatio: 0.02});
    });
  }
});

test.describe('homepage Story mobile guardrails', () => {
  test.use({viewport: {width: 390, height: 844}});

  for (const [name, storyPage] of scenes) {
    test(`matches the approved mobile ${name} scene`, async ({page}) => {
      await prepareStory(page);
      await scrollStoryTo(page, storyPage);
      await expect(page.locator('html')).toHaveJSProperty('scrollWidth', 390);
      await expect(page).toHaveScreenshot(`story-${snapshotKind}-mobile-${name}.png`, {fullPage: false, maxDiffPixelRatio: 0.02});
    });
  }
});
