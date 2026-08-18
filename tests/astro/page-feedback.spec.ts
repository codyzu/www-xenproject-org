import {expect, type Page, test} from '@playwright/test';

const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe-iZArE5eDXG0rbFRAbMhh_p3vTDL37y5Y9Tw30aFdOzMBKA/viewform';
const pageUrlField = 'entry.1495144884';
const helpfulnessField = 'entry.323267374';

const expectFeedbackLinks = async (page: Page, path: string) => {
  const feedback = page.locator('[data-page-feedback]');
  const yes = feedback.getByRole('link', {name: 'Yes, this page was helpful'});
  const no = feedback.getByRole('link', {name: 'No, this page was not helpful'});
  const suggestion = feedback.getByRole('link', {name: 'Have a suggestion?'});
  const expectedPageUrl = `https://xenproject.org${path}`;

  await expect(feedback).toBeVisible();
  await expect(feedback).toContainText('Was this page helpful?');
  await expect(feedback.locator('.i-carbon-thumbs-up')).toHaveAttribute('aria-hidden', 'true');
  await expect(feedback.locator('.i-carbon-thumbs-down')).toHaveAttribute('aria-hidden', 'true');

  for (const [link, helpfulness] of [
    [yes, 'Yes'],
    [no, 'No'],
    [suggestion, undefined],
  ] as const) {
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();
    const url = new URL(href!);
    expect(`${url.origin}${url.pathname}`).toBe(formUrl);
    expect(url.searchParams.get('usp')).toBe('pp_url');
    expect(url.searchParams.get(pageUrlField)).toBe(expectedPageUrl);
    expect(url.searchParams.get(helpfulnessField)).toBe(helpfulness ?? null);
  }

  const rawYesUrl = await yes.getAttribute('href');
  expect(rawYesUrl).toContain(`${pageUrlField}=https%3A%2F%2Fxenproject.org%2F${path.slice(1).replaceAll('/', '%2F')}`);

  await yes.focus();
  await expect(yes).toBeFocused();
  await expect(yes).toHaveCSS('min-height', '44px');
};

test.describe('Page feedback', () => {
  test('uses production-canonical, encoded Google Forms links on representative pages', async ({page}) => {
    for (const path of ['/', '/technology/safety/', '/resources/use-cases/', '/about/governance/']) {
      await page.goto(path);
      await expectFeedbackLinks(page, path);
      await expect(page.locator('main > [data-page-feedback]')).toHaveCount(1);
      await expect(page.locator('main > [data-page-feedback] + *')).toHaveCount(0);
      await expect(page.locator('body > footer')).toBeVisible();
    }
  });

  test('wraps without horizontal overflow on a narrow viewport', async ({page}) => {
    await page.setViewportSize({width: 375, height: 812});
    await page.goto('/technology/safety/');
    await expectFeedbackLinks(page, '/technology/safety/');

    const widths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  });

  test('stays off error pages, internal tools, and the legacy shell', async ({page}) => {
    for (const path of ['/404.html', '/internal/design-system/', '/research/']) {
      await page.goto(path);
      await expect(page.locator('[data-page-feedback]')).toHaveCount(0);
    }
  });
});
