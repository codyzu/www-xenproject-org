import {readFile} from 'node:fs/promises';
import {expect, test} from '@playwright/test';

const enrollmentUrl = 'https://enrollment.lfx.linuxfoundation.org/?project=xen';

test.describe('membership launch pages', () => {
  test.beforeEach(async ({page}) => {
    await page.route('https://ws.zoominfo.com/**', async (route) => route.abort());
  });

  test('presents the value-led hero and three-step support flow', async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('cookieConsent', 'false'));
    await page.goto('/about/become-a-member/');

    await expect(page.getByRole('heading', {level: 1, name: 'Support the shared foundation behind Xen.'})).toBeVisible();
    const hero = page.locator('#hero');
    const primaryHandoff = hero.getByRole('link', {name: 'Continue to the LF membership form'});
    await expect(primaryHandoff).toHaveAttribute('href', enrollmentUrl);
    await expect(primaryHandoff).toHaveAttribute('rel', 'external');
    await expect(primaryHandoff).not.toHaveAttribute('target', '_blank');
    await expect(hero.getByRole('link', {name: 'View current members'})).toHaveAttribute('href', '/about/project-members/');
    await expect(hero.locator('ol > li')).toHaveCount(3);
    await expect(page.getByRole('region', {name: 'Cookie consent banner'})).toHaveCount(0);
    await expect(page.locator('#cookie-banner astro-island')).toHaveCount(0);
  });

  test('features Premier Plus before four existing options and an immediate enrollment action', async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('cookieConsent', 'false'));
    await page.goto('/about/become-a-member/');

    const membershipOptions = page.locator('#membership-options');
    const featured = membershipOptions.locator('[data-featured-membership]');
    const standardOptions = membershipOptions.locator('[data-standard-membership-option]');
    await expect(featured).toBeVisible();
    await expect(featured).toContainText('Premier Plus membership');
    await expect(featured.getByRole('heading', {level: 3})).toContainText('highest membership level');
    await expect(standardOptions).toHaveCount(4);

    for (const name of ['Premier Member', 'Advisory Board Governing Member', 'Startup Member', 'Associate Member']) {
      await expect(standardOptions.getByRole('heading', {level: 3, name})).toBeVisible();
    }

    const membershipOrder = await membershipOptions
      .locator('[data-featured-membership], [data-standard-membership-option]')
      .evaluateAll(elements => elements.map(element => element.hasAttribute('data-featured-membership') ? 'featured' : 'standard'));
    expect(membershipOrder).toEqual(['featured', 'standard', 'standard', 'standard', 'standard']);

    const enrollmentAction = membershipOptions.getByRole('link', {name: 'Continue to the LF membership form'});
    await expect(enrollmentAction).toHaveAttribute('href', enrollmentUrl);
    await expect(enrollmentAction).toHaveAttribute('rel', 'external');
    await expect(membershipOptions.getByRole('link', {name: 'View current members'})).toHaveAttribute(
      'href',
      '/about/project-members/',
    );

    await expect(page.locator('#member-trust img')).toHaveCount(10);
    await expect(page.locator('#member-trust').getByRole('link', {name: 'View all Xen Project members'})).toHaveAttribute(
      'href',
      '/about/project-members/',
    );
  });

  test('keeps safety context and one consolidated final enrollment panel', async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('cookieConsent', 'false'));
    await page.goto('/about/become-a-member/');

    const safety = page.locator('#safety-participation');
    await expect(safety).toBeVisible();
    await expect(safety.getByRole('link', {name: 'Review safety-oriented work'})).toHaveAttribute(
      'href',
      '/technology/safety/',
    );
    await expect(safety).toContainText('Xen source code is not itself safety certified');
    await expect(safety).toContainText('complete system safety case');

    const finalCta = page.locator('#final-cta');
    await expect(finalCta).toHaveCount(1);
    await expect(page.locator('#linux-foundation-handoff')).toHaveCount(0);
    await expect(finalCta.getByRole('heading', {name: 'Ready to discuss Xen Project membership?'})).toBeVisible();
    await expect(finalCta).toContainText('The Linux Foundation handles validation, submission, membership workflow, and confirmation');
    await expect(finalCta.getByRole('link', {name: 'Continue to the LF membership form'})).toHaveAttribute(
      'href',
      enrollmentUrl,
    );
    await expect(finalCta.getByRole('link', {name: 'Email the project team'})).toHaveAttribute(
      'href',
      'mailto:community.manager@xenproject.org',
    );
    await expect(page.getByText('Continue with the organization that manages enrollment.')).toHaveCount(0);
    await expect(page.getByText('Ready to discuss organizational membership?')).toHaveCount(0);
  });

  for (const viewport of [
    {name: 'wide desktop', width: 1440, height: 1000},
    {name: 'ordinary laptop', width: 1280, height: 800},
    {name: 'iPad landscape', width: 1024, height: 768},
    {name: 'iPad portrait', width: 834, height: 1194},
    {name: 'mobile', width: 390, height: 844},
  ]) {
    test(`keeps featured membership and final actions readable at ${viewport.name}`, async ({page}) => {
      await page.setViewportSize({width: viewport.width, height: viewport.height});
      await page.addInitScript(() => localStorage.setItem('cookieConsent', 'false'));
      await page.goto('/about/become-a-member/');

      await expect(page.locator('[data-featured-membership]')).toBeVisible();
      await expect(page.locator('[data-standard-membership-option]')).toHaveCount(4);
      await expect(page.locator('#membership-options').getByRole('link', {name: 'Continue to the LF membership form'})).toBeVisible();
      await expect(page.locator('#final-cta').getByRole('link', {name: 'Email the project team'})).toBeVisible();

      const widths = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
    });
  }

  test('renders current members from the shared source with accessible names', async ({page}) => {
    await page.goto('/about/project-members/');

    await expect(page.getByRole('heading', {level: 1, name: 'Organizations sustaining the Xen Project.'})).toBeVisible();
    await expect(page.locator('#current-members img')).toHaveCount(10);
    await expect(page.locator('#current-members img[alt="AMD"]')).toHaveCount(1);
    await expect(page.locator('#current-members img[alt="Ford Motor Company"]')).toHaveCount(1);
    await expect(page.locator('#final-cta').getByRole('link', {name: 'Explore membership'})).toHaveAttribute('href', '/about/become-a-member/');
  });

  test('supports first visit, rejection, and persisted rejection', async ({page}) => {
    await page.goto('/about/become-a-member/');
    await page.evaluate(() => localStorage.removeItem('cookieConsent'));
    await page.reload();

    const banner = page.getByRole('region', {name: 'Cookie consent banner'});
    await expect(banner).toBeVisible();
    await expect(banner.getByRole('button', {name: 'Continue without analytics'})).toBeVisible();
    await expect(banner.getByRole('button', {name: 'Allow analytics'})).toBeVisible();
    await banner.getByRole('button', {name: 'Continue without analytics'}).click();

    await expect.poll(async () => page.evaluate(() => localStorage.getItem('cookieConsent'))).toBe('false');
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(banner).toBeHidden();
    await expect(page.locator('[data-xen-consent-script="zoominfo"]')).toHaveCount(0);
  });

  test('preserves accepted consent and gates the analytics script', async ({page}) => {
    await page.goto('/about/become-a-member/');
    await page.evaluate(() => localStorage.removeItem('cookieConsent'));
    await page.reload();

    const banner = page.getByRole('region', {name: 'Cookie consent banner'});
    await banner.getByRole('button', {name: 'Allow analytics'}).click();
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('cookieConsent'))).toBe('true');
    await expect(page.locator('[data-xen-consent-script="zoominfo"]')).toHaveCount(1);

    await page.reload();
    await expect(banner).toBeHidden();
    await expect(page.locator('[data-xen-consent-script="zoominfo"]')).toHaveCount(1);
  });

  test('recovers from malformed and unavailable storage', async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('cookieConsent', '{malformed'));
    await page.goto('/about/become-a-member/');
    await expect(page.getByRole('region', {name: 'Cookie consent banner'})).toBeVisible();

    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error('storage unavailable');
      };
      Storage.prototype.setItem = () => {
        throw new Error('storage unavailable');
      };
    });
    await page.reload();

    const banner = page.getByRole('region', {name: 'Cookie consent banner'});
    await expect(banner).toBeVisible();
    await banner.getByRole('button', {name: 'Continue without analytics'}).click();
    await expect(banner).toBeHidden();
  });

  test('keeps the consent choice reachable by keyboard on mobile', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('/about/become-a-member/');
    await page.evaluate(() => localStorage.removeItem('cookieConsent'));
    await page.reload();

    const banner = page.getByRole('region', {name: 'Cookie consent banner'});
    const rejectButton = banner.getByRole('button', {name: 'Continue without analytics'});
    const box = await banner.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);

    await rejectButton.focus();
    await expect(rejectButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(banner).toBeHidden();
  });

  test('keeps the screenshot defaults focused and deterministic', async () => {
    const source = await readFile('scripts/astro/screenshots.ts', 'utf8');
    for (const route of [
      "'/'",
      "'/projects/embedded-and-automotive/'",
      "'/resources/use-cases/'",
      "'/technology/safety/'",
      "'/about/become-a-member/'",
      "'/about/project-members/'",
    ]) {
      expect(source).toContain(route);
    }

    expect(source).toContain("localStorage.setItem('cookieConsent', 'false')");
    expect(source).toContain("name: 'tablet'");
  });
});
