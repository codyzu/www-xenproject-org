import {expect, test} from '@playwright/test';
import {
  assertHighValuePage,
  assertNoSeriousAccessibilityViolations,
  assertSafetyAnchor,
  highValuePages,
  monitorPageRuntime,
  type ViewportProfile,
} from './helpers/high-value';

const mobileProfile: ViewportProfile = {
  name: 'mobile',
  options: {},
  stackedHero: true,
};

test.describe('High-value mobile WebKit pages', {tag: '@high-value'}, () => {
  for (const pageContract of highValuePages) {
    test(`${pageContract.name} on mobile WebKit`, async ({page}, testInfo) => {
      await page.emulateMedia({reducedMotion: 'reduce'});
      const runtime = monitorPageRuntime(page, String(testInfo.project.use.baseURL));
      await assertHighValuePage(page, pageContract, mobileProfile);

      if (pageContract.name === 'safety') {
        await assertSafetyAnchor(page);
      }

      if (pageContract.name === 'homepage') {
        await page.evaluate(() => globalThis.scrollTo(0, 240));
        const menuToggle = page.getByRole('button', {name: 'Toggle mobile navigation'});
        await menuToggle.focus();
        await menuToggle.click();

        const mobileNav = page.getByRole('navigation', {name: 'Mobile navigation'});
        await expect(mobileNav).toBeVisible();
        await expect(page.locator('body')).toHaveCSS('position', 'fixed');

        const technology = mobileNav.locator('summary', {hasText: 'Technology'});
        const developers = mobileNav.locator('summary', {hasText: 'Developers'});
        await technology.click();
        await expect(mobileNav.getByRole('link', {name: 'Technology overview'})).toHaveAttribute('href', '/technology/');
        await expect(mobileNav.locator('details[data-mobile-nav-section][open]')).toHaveCount(1);

        await developers.click();
        await expect(mobileNav.locator('details[data-mobile-nav-section][open]')).toHaveCount(1);
        expect(await technology.evaluate(summary => summary.parentElement?.hasAttribute('open') ?? false)).toBe(false);

        await assertNoSeriousAccessibilityViolations(page);

        await page.keyboard.press('Escape');
        await expect(mobileNav).not.toBeVisible();
        await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
        await expect(menuToggle).toBeFocused();
        await expect.poll(async () => page.evaluate(() => globalThis.scrollY)).toBe(240);
      }

      await runtime.assertHealthy();
    });
  }
});
