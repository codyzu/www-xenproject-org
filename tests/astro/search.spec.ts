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
