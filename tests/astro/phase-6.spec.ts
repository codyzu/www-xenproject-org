import process from 'node:process';
import {expect, test} from '@playwright/test';

const siteUrl = process.env.SITE_URL ?? 'https://beta.xenproject.org';

test.describe('Phase 6 data-driven routes', () => {
  test('renders latest downloads and searches the full archive', async ({page}) => {
    await page.goto('/resources/downloads/');
    const downloads = (await page.evaluate(async () =>
      fetch('/data/downloads.json').then(async (response) => response.json()),
    )) as Array<{key: string; name: string; versions: Array<{name: string}>}>;
    const searchableXenRelease = downloads
      .find((group) => group.key === 'xen')
      ?.versions.find((version) => !version.name.includes('-rc'));
    expect(searchableXenRelease).toBeDefined();
    await expect(page.getByRole('heading', {level: 1, name: 'Downloads'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Xen'}).first()).toBeVisible();

    const search = page.getByRole('searchbox', {name: 'Search downloads'});
    const results = page.locator('.search-results');
    await search.fill('4');
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
    await search.fill(`xen ${searchableXenRelease!.name}`);
    await expect(results.getByRole('link', {name: `Xen ${searchableXenRelease!.name}`, exact: true})).toBeVisible();
    await search.fill('not-a-real-release');
    await expect(results.getByText('No downloads found.')).toBeVisible();
    await search.fill('');
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
  });

  test('keeps download groups readable without mobile overflow', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('/resources/downloads/');
    const groupCount = await page.evaluate(
      async () => ((await fetch('/data/downloads.json').then(async (response) => response.json())) as unknown[]).length,
    );

    const groupHeadings = page.locator('[data-download-group] h3');
    await expect(groupHeadings).toHaveCount(groupCount);
    const headingPositions = await groupHeadings.evaluateAll((headings) =>
      headings.map((heading) => heading.getBoundingClientRect().top),
    );
    expect(headingPositions).toEqual([...headingPositions].sort((a, b) => a - b));

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('sorts the past-event archive by event end date', async ({page}) => {
    await page.goto('/resources/past-events/');
    const cards = page.locator('[data-event-id]');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toHaveAttribute('data-event-id', 'xen-summit-2026');
    await expect(cards.nth(0).getByRole('link', {name: 'View recap'})).toHaveAttribute('href', '/resources/summit-2026/');
    await expect(cards.nth(1)).toHaveAttribute('data-event-id', 'spring-meetup-2026');
    await expect(cards.nth(2)).toHaveAttribute('data-event-id', 'xen-summit-2025');
    await expect(cards.nth(1)).not.toContainText('April 2–3, 2026');
    await expect(cards.nth(2)).toContainText('San Jose, California, USA');
  });

  test('renders the archived Summit detail route', async ({page}) => {
    await page.goto('/resources/past-events/xen-summit-2025/');
    await expect(page).toHaveTitle(/Xen Summit 2025/);
    await expect(page.getByRole('heading', {name: /Thank You for Joining/})).toBeVisible();
    await expect(page.getByRole('link', {name: /Sched agenda/})).toHaveAttribute(
      'href',
      'https://xensummit2025.sched.com/',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/resources\/past-events\/xen-summit-2025\/$/,
    );
  });

  test('renders the permanent Summit recap with the highlight film', async ({page}) => {
    await page.route('https://www.youtube.com/embed/**', (route) => route.fulfill({status: 200, body: '<html><body>Video player</body></html>', contentType: 'text/html'}));
    await page.goto('/resources/summit-2026/');
    await expect(page.getByRole('heading', {level: 1, name: 'Xen Summit 2026'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Watch all talks', exact: true}).first()).toHaveAttribute(
      'href', 'https://www.youtube.com/playlist?list=PLGe6RWOETgTQ',
    );
    await expect(page.getByRole('link', {name: 'View the program and speakers'})).toHaveAttribute(
      'href', 'https://xensummit2026.sched.com/',
    );
    const main = page.getByRole('main');
    await expect(main).not.toContainText(/registration open|register now|early bird|booking|details.*soon|become a sponsor/i);
    await expect(main.locator('a[href*="register.linuxfoundation.org"]')).toHaveCount(0);
    const highlight = page.locator('#highlights iframe');
    await expect(highlight).toHaveAttribute('src', 'https://www.youtube.com/embed/KO1fWJyXCc0?rel=0');
    await expect(highlight).toHaveAttribute('title', 'Xen Summit 2026 highlight film');
    await expect(highlight).toHaveAttribute('allowfullscreen', '');
    await expect(page.getByRole('link', {name: 'Watch the highlight film on YouTube'})).toHaveAttribute('href', 'https://www.youtube.com/watch?v=KO1fWJyXCc0');
    await expect(main).not.toContainText('will be embedded');
    await expect(page.locator('#highlights').getByRole('link', {name: 'Watch all talks'})).toBeVisible();
    const jumpLinks = page.getByText('Explore the recap:').getByRole('link');
    for (const jumpLink of await jumpLinks.all()) {
      const target = await jumpLink.getAttribute('href');
      await expect(page.locator(target!)).toHaveCount(1);
    }
    for (const width of [390, 834, 1440]) {
      await page.setViewportSize({width, height: 900});
      expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
      await expect(page.locator('#highlights').getByRole('link', {name: 'Watch all talks'})).toBeVisible();
      const bounds = await highlight.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.width / bounds!.height).toBeCloseTo(16 / 9, 1);
    }
    await page.setViewportSize({width: 1440, height: 1200});
    const sponsorWidths = new Map<string, number>();
    for (const sponsorName of ['Renesas', 'Honda', 'XenServer', 'Arm', 'Vates', 'Edera']) {
      const sponsorLogo = page.getByRole('img', {name: `${sponsorName} logo`}).last();
      await expect(sponsorLogo).toBeVisible();
      expect(await sponsorLogo.evaluate((image) => ({width: image.clientWidth, height: image.clientHeight}))).toEqual(
        expect.objectContaining({width: expect.any(Number), height: expect.any(Number)}),
      );
      expect(await sponsorLogo.evaluate((image) => image.clientWidth > 0 && image.clientHeight > 0)).toBe(true);
      sponsorWidths.set(sponsorName, await sponsorLogo.evaluate((image) => image.clientWidth));
    }
    expect(Math.min(sponsorWidths.get('Renesas')!, sponsorWidths.get('Honda')!)).toBeGreaterThan(
      Math.max(sponsorWidths.get('XenServer')!, sponsorWidths.get('Arm')!),
    );
    expect(Math.min(sponsorWidths.get('XenServer')!, sponsorWidths.get('Arm')!)).toBeGreaterThan(
      sponsorWidths.get('Vates')!,
    );
    expect(sponsorWidths.get('Vates')!).toBeGreaterThan(sponsorWidths.get('Edera')!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}/resources/summit-2026/`);
  });
});
