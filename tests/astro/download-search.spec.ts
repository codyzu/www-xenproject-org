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
  test('uses release channels as keyboard-accessible links to the detailed cards', async ({page}) => {
    await page.goto('/resources/downloads/');

    const console = page.getByLabel('Choose a release channel');
    const xcpngChannel = console.getByRole('link', {name: /XCP-ng.*View release/});
    await xcpngChannel.focus();
    await expect(xcpngChannel).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#xcpng-releases$/);
    const xcpngCard = page.locator('#xcpng-releases');
    await expect(xcpngCard).toBeFocused();
    await expect(xcpngCard).toHaveCSS('animation-name', 'release-card-target');
    await expect(xcpngCard).toBeInViewport();

    await console.getByRole('link', {name: /Xen.*View release/}).click();
    await expect(page).toHaveURL(/#xen-releases$/);
    await expect(page.locator('#xen-releases')).toBeFocused();
  });

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
    const resultIconGap = await resultLink.evaluate(link => {
      const label = link.querySelector('span')?.getBoundingClientRect();
      const icon = link.querySelector('[aria-hidden="true"]')?.getBoundingClientRect();
      return label && icon ? icon.left - label.right : 0;
    });
    expect(resultIconGap).toBeGreaterThan(0);

    await search.fill('not a release');
    await expect(results.getByText('No downloads found.')).toBeVisible();
    await search.clear();
    await page.waitForTimeout(350);
    await expect(results).toBeEmpty();
    expect(requests).toBe(1);
  });

  test('renders the curated XCP-ng artifact set and respects reduced motion', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('/resources/downloads/');

    const xen = page.locator('[data-download-group="xen"]');
    const xcpng = page.locator('[data-download-group="xcpng"]');
    await expect(xen.getByText('Source', {exact: true})).toHaveClass(/uno-text-xp-accent-primary/);
    await expect(xcpng.getByText('Installer', {exact: true})).toHaveClass(/uno-text-xp-text-muted/);
    await expect(xcpng.getByRole('link', {name: /Standard installer ISO/})).toHaveAttribute('href', /xcp-ng-8\.3\.0-\d{8}(?:\.\d+)?\.iso\?https=1$/);
    await expect(xcpng.getByRole('link', {name: /Network installer ISO/})).toHaveAttribute('href', /netinstall\.iso\?https=1$/);
    await expect(xcpng.getByRole('link', {name: /SHA256 checksums/})).toHaveAttribute('href', /SHA256SUMS\?https=1$/);
    await expect(xcpng.getByRole('link', {name: /Checksum signature/})).toHaveAttribute('href', /SHA256SUMS\.asc\?https=1$/);
    await expect(page.locator('[data-download-group="windowspvdrivers"]')).toHaveCount(0);
    await expect(page.locator('main').getByText('Windows PV Drivers')).toHaveCount(0);
    expect(await page.locator('.release-console').evaluate(element => getComputedStyle(element, '::after').animationName)).toBe('none');
    await page.getByLabel('Choose a release channel').getByRole('link', {name: /Mirage OS.*View release/}).click();
    await expect(page.locator('#mirageos-releases')).toHaveCSS('animation-name', 'none');
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
