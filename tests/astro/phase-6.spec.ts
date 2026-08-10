import process from 'node:process';
import {expect, test} from '@playwright/test';
import {allDownloads, latestDownloads} from '../../src/data/downloads';

const siteUrl = process.env.SITE_URL ?? 'https://beta.xenproject.org';
const latestXenGroup = latestDownloads.find(group => group.key === 'xen');
const allXenGroup = allDownloads.find(group => group.key === 'xen');
const latestXenSeries = latestXenGroup?.versions[0];
const searchableXenRelease = allXenGroup?.versions.findLast(version => !version.name.includes('-rc'));

if (!latestXenSeries || !searchableXenRelease) {
  throw new Error('Expected Xen download data to include a latest series and stable release');
}

test.describe('Phase 6 data-driven routes', () => {
  test('renders latest downloads and searches the full archive', async ({page}) => {
    await page.goto('/resources/downloads/');
    await expect(page.getByRole('heading', {level: 1, name: 'Downloads'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Xen'}).first()).toBeVisible();
    await expect(page.getByText(`Xen ${latestXenSeries.name} Series`)).toBeVisible();

    const search = page.getByRole('searchbox', {name: 'Search downloads'});
    const results = page.locator('.search-results');
    await search.fill('4');
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
    await search.fill(`xen ${searchableXenRelease.name}`);
    await expect(results.getByText(`Xen ${searchableXenRelease.name}`)).toBeVisible();
    await search.fill('not-a-real-release');
    await expect(results.getByText('No downloads found.')).toBeVisible();
    await search.fill('');
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
  });

  test('keeps download groups readable without mobile overflow', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('/resources/downloads/');

    const groupHeadings = page.locator('[data-download-group] h3');
    await expect(groupHeadings).toHaveCount(latestDownloads.length);
    const headingPositions = await groupHeadings.evaluateAll(headings => headings.map(heading => heading.getBoundingClientRect().top));
    expect(headingPositions).toEqual([...headingPositions].sort((a, b) => a - b));

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('sorts the past-event archive by event end date', async ({page}) => {
    await page.goto('/resources/past-events/');
    const cards = page.locator('[data-event-id]');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toHaveAttribute('data-event-id', 'spring-meetup-2026');
    await expect(cards.nth(1)).toHaveAttribute('data-event-id', 'xen-summit-2025');
    await expect(cards.nth(0)).not.toContainText('April 2–3, 2026');
    await expect(cards.nth(1)).toContainText('San Jose, California, USA');
  });

  test('renders the archived Summit detail route', async ({page}) => {
    await page.goto('/resources/past-events/xen-summit-2025/');
    await expect(page).toHaveTitle(/Xen Summit 2025/);
    await expect(page.getByRole('heading', {name: /Thank You for Joining/})).toBeVisible();
    await expect(page.getByRole('link', {name: /Sched agenda/})).toHaveAttribute('href', 'https://xensummit2025.sched.com/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/resources\/past-events\/xen-summit-2025\/$/);
  });

  test('renders event hero and live ticket pricing', async ({page}) => {
    await page.goto('/resources/summit-2026/');
    await expect(page.getByRole('heading', {level: 1, name: 'Xen Summit 2026'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Register Now'}).first()).toHaveAttribute('href', 'https://register.linuxfoundation.org/xen-summit-2026');
    await expect(page.getByRole('link', {name: 'View the Schedule'}).first()).toHaveAttribute('href', 'https://xensummit2026.sched.com/');
    await expect(page.getByRole('link', {name: 'Become a Sponsor'}).first()).toHaveAttribute('href', '/assets/summit-2026/xen-summit-2026-sponsor-prospectus.pdf');
    await expect(page.getByText(/call for proposals|submit a proposal|submit a talk|july 7, 2026/i)).toHaveCount(0);
    await expect(page.locator('#registration-pricing .ticket-card')).toHaveCount(5);
    await expect(page.locator('#registration-pricing .card__actions')).toHaveCount(3);
    const earlyBirdCard = page.locator('#registration-pricing .ticket-card').filter({has: page.getByRole('heading', {name: /In-Person Early Bird \$140 Closed/})});
    await expect(earlyBirdCard).toHaveClass(/ticket-card--closed/);
    await expect(earlyBirdCard.locator('s')).toHaveText('In-Person Early Bird $140');
    await expect(earlyBirdCard.getByRole('link')).toHaveCount(0);
    const speakerCard = page.locator('#registration-pricing .ticket-card').filter({has: page.getByRole('heading', {name: 'Speaker Free'})});
    await expect(speakerCard.getByRole('link')).toHaveCount(0);
    const jumpLinks = page.getByText('Jump to:').getByRole('link');
    for (const jumpLink of await jumpLinks.all()) {
      const target = await jumpLink.getAttribute('href');
      expect(target).toMatch(/^#[a-z-]+$/);
      await expect(page.locator(target!)).toHaveCount(1);
    }
    const inPersonGroup = page.locator('.ticket-group-in-person');
    const columnCount = async () => inPersonGroup.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(await columnCount()).toBe(4);
    await page.setViewportSize({width: 900, height: 900});
    expect(await columnCount()).toBe(2);
    await page.setViewportSize({width: 390, height: 844});
    expect(await columnCount()).toBe(1);
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
    await page.locator('label[for^="virtual-"]').click();
    await expect(page.locator('.ticket-group-virtual')).toBeVisible();
    for (const sponsorName of ['Renesas', 'XenServer', 'Vates']) {
      const sponsorLogo = page.getByRole('img', {name: `${sponsorName} logo`}).last();
      await expect(sponsorLogo).toBeVisible();
      expect(await sponsorLogo.evaluate((image) => ({width: image.clientWidth, height: image.clientHeight}))).toEqual(expect.objectContaining({width: expect.any(Number), height: expect.any(Number)}));
      expect(await sponsorLogo.evaluate((image) => image.clientWidth > 0 && image.clientHeight > 0)).toBe(true);
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteUrl}/resources/summit-2026/`);
  });
});
