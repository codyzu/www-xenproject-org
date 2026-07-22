import { expect, test } from '@playwright/test';

import {
  createProfilePage,
  monitorPageRuntime,
  settlePage,
} from './helpers/high-value';

test.describe('@high-value primary navigation', () => {
  test('desktop supports hover and keyboard navigation', async ({ page }, testInfo) => {
    const runtime = monitorPageRuntime(page, testInfo.project.use.baseURL as string);

    const response = await page.goto('/');
    expect(response?.ok()).toBe(true);
    await settlePage(page);

    const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
    const technology = navigation.getByRole('button', { name: 'Technology', exact: true });
    const projects = navigation.getByRole('button', { name: 'Projects', exact: true });
    const developers = navigation.getByRole('button', { name: 'Developers', exact: true });
    const technologyPopover = page.locator('#xp-nav-popover-0');
    const projectsPopover = page.locator('#xp-nav-popover-1');

    await technology.hover();
    await expect(technology).toHaveAttribute('aria-expanded', 'true');
    await expect(technologyPopover).toBeVisible();

    await technologyPopover.hover();
    await page.waitForTimeout(200);
    await expect(technologyPopover).toBeVisible();

    await projects.hover();
    await expect(projects).toHaveAttribute('aria-expanded', 'true');
    await expect(projectsPopover).toBeVisible();
    await expect(technology).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-nav-popover]:popover-open')).toHaveCount(1);

    await page.mouse.move(20, 500);
    await page.waitForTimeout(200);
    await expect(projects).toHaveAttribute('aria-expanded', 'false');

    await technology.focus();
    await page.keyboard.press('Enter');
    await expect(technology).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(technologyPopover.getByRole('link', { name: 'Technology overview' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(technology).toHaveAttribute('aria-expanded', 'false');
    await expect(technology).toBeFocused();

    await developers.focus();
    await page.keyboard.press('Space');
    await expect(developers).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(developers).toHaveAttribute('aria-expanded', 'false');
    await expect(developers).toBeFocused();

    await runtime.assertHealthy();
  });

  test('iPad landscape supports touch disclosure and overview navigation', async ({
    browser,
  }, testInfo) => {
    const baseURL = testInfo.project.use.baseURL as string;
    const { context, page, runtime } = await createProfilePage(browser, baseURL, {
      viewport: { width: 1024, height: 768 },
      hasTouch: true,
      isMobile: false,
      reducedMotion: 'reduce',
    });
    try {
      const response = await page.goto('/');
      expect(response?.ok()).toBe(true);
      await settlePage(page);

      await expect
        .poll(() => page.evaluate(() => matchMedia('(pointer: coarse)').matches))
        .toBe(true);
      await expect
        .poll(() => page.evaluate(() => matchMedia('(hover: none)').matches))
        .toBe(true);

      const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
      const technology = navigation.getByRole('button', { name: 'Technology', exact: true });
      const projects = navigation.getByRole('button', { name: 'Projects', exact: true });
      const technologyPopover = page.locator('#xp-nav-popover-0');

      await technology.click();
      await expect(page).toHaveURL(/\/$/);
      await expect(technology).toHaveAttribute('aria-expanded', 'true');
      await expect(technologyPopover).toBeVisible();
      await expect(page.locator('[data-nav-popover]:popover-open')).toHaveCount(1);

      await technology.locator('.xp-nav-chevron').click();
      await expect(technology).toHaveAttribute('aria-expanded', 'false');

      await technology.click();
      await projects.click();
      await expect(technology).toHaveAttribute('aria-expanded', 'false');
      await expect(projects).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('[data-nav-popover]:popover-open')).toHaveCount(1);

      await page.mouse.click(8, 740);
      await expect(projects).toHaveAttribute('aria-expanded', 'false');

      await technology.click();
      await technologyPopover.getByRole('link', { name: 'Technology overview' }).click();
      await expect(page).toHaveURL(/\/technology\/$/);

      await runtime.assertHealthy();
    } finally {
      await context.close();
    }
  });
});
