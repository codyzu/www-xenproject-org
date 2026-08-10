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

    const projectLink = projectsPopover.getByRole('link', { name: 'Hypervisor', exact: true });
    const projectHeading = projectsPopover.getByRole('heading', { name: 'Core', exact: true });
    const restingBox = await projectLink.boundingBox();
    const restingHeadingColor = await projectHeading.evaluate(element => getComputedStyle(element).color);

    await projectLink.hover();
    await expect(projectLink).toHaveCSS('background-color', 'rgb(20, 34, 56)');
    await expect(projectLink).toHaveCSS('border-bottom-color', 'rgba(198, 214, 235, 0.14)');
    await expect(projectLink).toHaveCSS('color', 'rgb(247, 251, 255)');
    expect(await projectLink.evaluate(element => {
      const accent = getComputedStyle(element, '::before');
      return {
        backgroundColor: accent.backgroundColor,
        opacity: accent.opacity,
        width: accent.width,
      };
    })).toEqual({
      backgroundColor: 'rgb(133, 194, 65)',
      opacity: '1',
      width: '2px',
    });
    const hoveredBox = await projectLink.boundingBox();
    expect(hoveredBox).not.toBeNull();
    expect(restingBox).not.toBeNull();
    expect(hoveredBox?.x).toBeCloseTo(restingBox?.x ?? 0, 3);
    expect(hoveredBox?.width).toBeCloseTo(restingBox?.width ?? 0, 3);
    expect(hoveredBox?.height).toBeCloseTo(restingBox?.height ?? 0, 3);
    await expect(projectHeading).toHaveCSS('color', restingHeadingColor);

    await projectLink.focus();
    await expect(projectLink).toBeFocused();
    await expect(projectLink).toHaveCSS('outline-style', 'solid');
    await expect(projectLink).toHaveCSS('outline-color', 'rgb(93, 154, 45)');
    expect(await projectLink.evaluate(element => getComputedStyle(element, '::before').opacity)).toBe('1');

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

  test('laptop-width fine pointers keep the contained hover row in view', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await settlePage(page);

    await expect.poll(() => page.evaluate(() => ({
      fine: matchMedia('(pointer: fine)').matches,
      hover: matchMedia('(hover: hover)').matches,
    }))).toEqual({ fine: true, hover: true });

    const projects = page.getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('button', { name: 'Projects', exact: true });
    await projects.hover();
    const projectLink = page.locator('#xp-nav-popover-1')
      .getByRole('link', { name: 'Hypervisor', exact: true });
    await projectLink.hover();

    await expect(projectLink).toHaveCSS('background-color', 'rgb(20, 34, 56)');
    expect(await projectLink.evaluate(element => getComputedStyle(element, '::before').opacity)).toBe('1');
    const rowBox = await projectLink.boundingBox();
    expect(rowBox).not.toBeNull();
    expect((rowBox?.x ?? 0) + (rowBox?.width ?? 0)).toBeLessThanOrEqual(1024);
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
