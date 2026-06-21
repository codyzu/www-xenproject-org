import {expect, test} from '@playwright/test';

const downloadGroups = [
  {
    name: 'Xen',
    versions: [
      {name: '4.19.1', link: 'https://downloads.xenproject.org/release/xen/4.19.1/'},
      {name: '4.18.3', link: 'https://downloads.xenproject.org/release/xen/4.18.3/'},
    ],
  },
  {
    name: 'XenServer',
    versions: [{name: '8.4', link: 'https://xenserver.com/downloads/8.4'}],
  },
];

test.describe('download search states', () => {
  test('loads once and performs grouped, case-insensitive multi-term search', async ({page}) => {
    let requests = 0;
    await page.route('**/data/downloads.json', async route => {
      requests += 1;
      await route.fulfill({json: downloadGroups});
    });
    await page.goto('/resources/downloads/');

    const searchRoot = page.locator('[data-download-search]');
    await expect(searchRoot).toHaveAttribute('data-download-search-state', 'ready');
    await expect(searchRoot).toHaveAttribute('aria-busy', 'false');
    const search = page.getByRole('searchbox', {name: 'Search downloads'});
    const results = page.locator('.search-results');

    await search.fill('4');
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();

    await search.fill('XEN 4.19');
    const resultLink = results.getByRole('link', {name: 'Xen 4.19.1'});
    await expect(resultLink).toHaveAttribute('href', 'https://downloads.xenproject.org/release/xen/4.19.1/');
    await expect(results.getByRole('heading', {name: 'Xen', exact: true})).toBeVisible();

    await search.fill('not a release');
    await expect(results.getByText('No downloads found.')).toBeVisible();
    await search.clear();
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
    expect(requests).toBe(1);
  });

  test('reports loading and a distinct HTTP failure', async ({page}) => {
    let releaseResponse: (() => void) | undefined;
    const responseGate = new Promise<void>(resolve => {
      releaseResponse = resolve;
    });
    await page.route('**/data/downloads.json', async route => {
      await responseGate;
      await route.fulfill({status: 503, json: {}});
    });
    await page.goto('/resources/downloads/');

    const searchRoot = page.locator('[data-download-search]');
    await expect(searchRoot).toHaveAttribute('aria-busy', 'true');
    releaseResponse?.();
    await expect(searchRoot).toHaveAttribute('data-download-search-state', 'error');
    await expect(searchRoot).toHaveAttribute('aria-busy', 'false');
    await expect(searchRoot.getByRole('alert')).toHaveText('Downloads are temporarily unavailable.');
  });

  test('reports malformed download data as a service failure', async ({page}) => {
    await page.route('**/data/downloads.json', async route => route.fulfill({json: {versions: []}}));
    await page.goto('/resources/downloads/');

    const searchRoot = page.locator('[data-download-search]');
    await expect(searchRoot).toHaveAttribute('data-download-search-state', 'error');
    await expect(searchRoot.getByRole('alert')).toHaveText('Downloads are temporarily unavailable.');
  });
});
