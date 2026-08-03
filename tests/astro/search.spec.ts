import {expect, test} from '@playwright/test';

test.describe('unified Pagefind search', () => {
  test.skip(process.env.SEARCH_FIXTURE_TEST !== '1', 'Run with npm run test:astro:search');

  test.beforeEach(async ({page}) => {
    await page.route('**/blog/**', async route => route.fulfill({
      body: '<!doctype html><title>Synthetic Ghost destination</title>',
      contentType: 'text/html',
    }));
    await page.goto('/');
  });

  test('opens from the desktop header and searches Astro and Ghost records', async ({page}) => {
    const trigger = page.getByRole('button', {name: 'Search Xen Project'});
    await trigger.click();
    const dialog = page.getByRole('dialog', {name: 'Search the site'});
    const input = dialog.getByRole('searchbox', {name: 'Search Xen Project'});
    await expect(input).toBeFocused();

    await input.fill('public testing resources');
    await expect(dialog.locator('a[data-search-result][href="/"]')).toBeVisible();

    await input.fill('XenStore');
    const blogResult = dialog.locator('a[href="/blog/pvh-live-migration-lab/"]');
    await expect(blogResult).toBeVisible();
    await expect(blogResult).toContainText('Blog');
    await expect(blogResult).toContainText('PVH live migration lab');
    await expect(blogResult).toHaveAttribute('data-search-source', 'Blog');

    await input.fill('control domain');
    await expect(blogResult).toBeVisible();
  });

  test('clearly distinguishes and filters mixed Website and Blog results', async ({page}) => {
    await page.getByRole('button', {name: 'Search Xen Project'}).click();
    const dialog = page.getByRole('dialog', {name: 'Search the site'});
    const input = dialog.getByRole('searchbox', {name: 'Search Xen Project'});
    await input.fill('open virtualization');

    const websiteResult = dialog.locator('a[data-search-source="Website"][href="/"]');
    const blogResult = dialog.locator('a[data-search-source="Blog"][href="/blog/open-virtualization-boundaries/"]');
    await expect(websiteResult).toBeVisible();
    await expect(websiteResult).toContainText('Xen Project website');
    await expect(blogResult).toBeVisible();
    await expect(blogResult).toContainText('Xen Project Blog');

    await dialog.getByRole('button', {name: 'Blog'}).click();
    await expect(dialog.getByRole('button', {name: 'Blog'})).toHaveAttribute('aria-pressed', 'true');
    await expect(blogResult).toBeVisible();
    await expect(dialog.locator('a[data-search-source="Website"]')).toHaveCount(0);

    await dialog.getByRole('button', {name: 'Website'}).click();
    await expect(websiteResult).toBeVisible();
    await expect(dialog.locator('a[data-search-source="Blog"]')).toHaveCount(0);
  });

  test('prioritizes the current Matrix destination and migration post for chat', async ({page}) => {
    await page.getByRole('button', {name: 'Search Xen Project'}).click();
    const dialog = page.getByRole('dialog', {name: 'Search the site'});
    await dialog.getByRole('searchbox', {name: 'Search Xen Project'}).fill('chat');

    await expect(dialog.locator('a[data-search-result][href="/resources/matrix/"]')).toBeVisible();
    await expect(dialog.locator('a[data-search-result][href="/blog/we-have-moved-to-matrix/"]')).toBeVisible();
    const orderedHrefs = await dialog.locator('a[data-search-result]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    expect(orderedHrefs[0]).toBe('/resources/matrix/');
    expect(orderedHrefs[1]).toBe('/blog/we-have-moved-to-matrix/');
    expect(orderedHrefs.indexOf('/blog/xen-irc-channels-have-moved/')).toBeGreaterThan(1);
  });

  test('supports keyboard navigation, Enter, Escape, clicking, and focus restoration', async ({page}) => {
    const trigger = page.getByRole('button', {name: 'Search Xen Project'});
    await trigger.click();
    const input = page.getByRole('searchbox', {name: 'Search Xen Project'});
    await input.fill('XenStore');
    await expect(page.locator('a[href="/blog/pvh-live-migration-lab/"]')).toBeVisible();
    await input.press('ArrowDown');
    await expect(page.locator('a[data-search-result][data-active]')).toHaveAttribute('href', '/blog/pvh-live-migration-lab/');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/blog\/pvh-live-migration-lab\/$/);

    await page.goto('/');
    await trigger.click();
    await page.getByRole('searchbox', {name: 'Search Xen Project'}).press('Escape');
    await expect(page.getByRole('dialog', {name: 'Search the site'})).not.toBeVisible();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await page.getByRole('searchbox', {name: 'Search Xen Project'}).fill('XenStore');
    await page.locator('a[href="/blog/pvh-live-migration-lab/"]').click();
    await expect(page).toHaveURL(/\/blog\/pvh-live-migration-lab\/$/);
  });

  test('is usable without horizontal overflow at a 390px mobile viewport', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    const trigger = page.getByRole('button', {name: 'Search Xen Project'});
    await trigger.click();
    const dialog = page.getByRole('dialog', {name: 'Search the site'});
    const searchbox = dialog.getByRole('searchbox', {name: 'Search Xen Project'});
    await expect(searchbox).toHaveAttribute('autofocus', '');
    await expect(searchbox).toBeFocused();
    await expect(dialog.locator('.xp-search-input-wrap kbd')).toBeHidden();
    await expect(dialog.locator('.xp-search-footer')).toBeHidden();
    const measurements = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: window.innerHeight,
      dialogHeight: document.querySelector('dialog')?.offsetHeight,
      bodyLocked: document.body.dataset.searchScrollLock,
    }));
    expect(measurements.documentWidth).toBe(measurements.viewportWidth);
    expect(Math.abs((measurements.dialogHeight ?? 0) - measurements.viewportHeight)).toBeLessThan(1);
    expect(measurements.bodyLocked).toBe('true');
  });

  test('tracks the iOS visual viewport while the software keyboard is present', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.addInitScript(() => {
      const viewport = new EventTarget();
      Object.defineProperties(viewport, {
        height: {configurable: true, value: 430, writable: true},
        offsetTop: {configurable: true, value: 84, writable: true},
      });
      Object.defineProperty(window, 'visualViewport', {configurable: true, value: viewport});
    });
    await page.reload();

    await page.getByRole('button', {name: 'Search Xen Project'}).click();
    const dialogElement = page.locator('[data-search-dialog]');
    const dialog = page.getByRole('dialog', {name: 'Search the site'});
    await expect(dialog).toHaveCSS('height', '430px');
    await expect(dialog).toHaveCSS('top', '84px');

    await page.evaluate(() => {
      Object.defineProperties(window.visualViewport, {
        height: {configurable: true, value: 360, writable: true},
        offsetTop: {configurable: true, value: 118, writable: true},
      });
      window.visualViewport?.dispatchEvent(new Event('resize'));
      window.visualViewport?.dispatchEvent(new Event('scroll'));
    });
    await expect(dialog).toHaveCSS('height', '360px');
    await expect(dialog).toHaveCSS('top', '118px');

    await dialog.getByRole('button', {name: 'Close search'}).click();
    await expect(dialogElement).toHaveAttribute('style', '');
  });

  test('opens with Control+K outside form fields and shows a quiet no-results state', async ({page}) => {
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', {name: 'Search the site'});
    const input = dialog.getByRole('searchbox', {name: 'Search Xen Project'});
    await expect(input).toBeFocused();
    await input.fill('🦄🦄🦄');
    await expect(dialog.getByRole('status')).toContainText('No results found');
    await expect(dialog.locator('[data-search-result]')).toHaveCount(0);
  });
});
