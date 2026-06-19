import {expect, test} from '@playwright/test';

test.describe('Phase 6 data-driven routes', () => {
  test('renders latest downloads and searches the full archive', async ({page}) => {
    await page.goto('/resources/downloads/');
    await expect(page.getByRole('heading', {level: 1, name: 'Downloads'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Xen'}).first()).toBeVisible();
    await expect(page.getByText('Xen 4.19 Series')).toBeVisible();

    const search = page.getByRole('searchbox', {name: 'Search downloads'});
    const results = page.locator('.search-results');
    await search.fill('4');
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
    await search.fill('xen 4.19');
    await expect(results.getByText('Xen 4.19.1')).toBeVisible();
    await search.fill('not-a-real-release');
    await expect(results.getByText('No downloads found.')).toBeVisible();
    await search.fill('');
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
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

  test('renders event hero and disabled ticket pricing', async ({page}) => {
    await page.goto('/resources/summit-2026/');
    await expect(page.getByRole('heading', {level: 1, name: 'Xen Summit 2026'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Submit a Proposal'}).first()).toHaveAttribute('target', '_blank');
    await expect(page.locator('#registration-pricing .ticket-card')).toHaveCount(5);
    await expect(page.locator('#registration-pricing .card__actions')).toHaveCount(0);
    await page.locator('label[for^="virtual-"]').click();
    await expect(page.locator('.ticket-group-virtual')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://xenproject.org/resources/summit-2026/');
  });
});
