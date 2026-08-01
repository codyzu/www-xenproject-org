import {readFile} from 'node:fs/promises';
import {expect, test} from '@playwright/test';
import {memberOrganizations} from '../../src/data/member-logos';

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
    await expect(featured).toContainText('direct participation in the Xen Safety Committee');
    await expect(featured).toContainText('voting representation on both the Advisory Board and the Safety Committee');
    await expect(featured).toContainText('access to committee-managed safety artifacts');
    await expect(featured).toContainText('a role in setting priorities and roadmap');
    await expect(featured).toContainText('qualified safety assessors');
    await expect(featured).toContainText('may disclose those artifacts');
    await expect(featured).not.toContainText('The Linux Foundation confirms current terms and eligibility through enrollment');
    await expect(featured).not.toContainText(/coming soon|subject to approval|details to be determined/i);
    await expect(membershipOptions).toContainText(
      'Current pricing and enrollment details are managed by the Linux Foundation.',
    );
    await expect(standardOptions).toHaveCount(4);

    for (const name of ['Premier Member', 'Advisory Board Governing Member', 'Startup Member', 'Associate Member']) {
      await expect(standardOptions.getByRole('heading', {level: 3, name})).toBeVisible();
    }
    await expect(standardOptions.filter({hasText: 'Premier Member'})).toContainText(
      'operations, shared infrastructure, events, communications, and community programs',
    );
    await expect(standardOptions.filter({hasText: 'Premier Member'})).not.toContainText('A current option listed');
    const governingMember = standardOptions.filter({hasText: 'Advisory Board Governing Member'});
    await expect(governingMember).toContainText('a voting representative on the Xen Project Advisory Board');
    await expect(governingMember).toContainText('non-technical governance and stewardship');
    await expect(governingMember).not.toContainText(/technical authority|upstream technical/i);

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
    await expect(page.locator('#member-trust')).toContainText(
      'Xen Project members provide stewardship, funding, and long-term support for the project.',
    );
    await expect(page.locator('#member-trust')).not.toContainText(/trust signal|canonical|shared data source/i);
    await expect(page.locator('#member-trust').getByRole('link', {name: 'View all Xen Project members'})).toHaveAttribute(
      'href',
      '/about/project-members/',
    );
    await expect(membershipOptions.getByRole('link', {name: 'Compare membership options'})).toHaveCount(0);
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
    await expect(safety.getByRole('heading', {name: 'Certification depends on the complete system'})).toHaveCount(0);
    await expect(safety).toContainText('Premier Plus supports shared safety-oriented engineering and committee-managed artifacts');
    await expect(safety).toContainText('System certification remains the responsibility of each organization');
    await expect(safety).not.toContainText(/membership delivers certification|Xen is safety certified/i);

    const finalCta = page.locator('#final-cta');
    await expect(finalCta).toHaveCount(1);
    await expect(page.locator('#linux-foundation-handoff')).toHaveCount(0);
    await expect(finalCta.getByRole('heading', {name: 'Ready to discuss Xen Project membership?'})).toBeVisible();
    await expect(finalCta).toContainText(
      'Continue to the Linux Foundation enrollment process, or contact the membership team to discuss Premier Plus and Xen Safety Committee participation.',
    );
    await expect(finalCta).toContainText('The Linux Foundation handles validation, submission, membership workflow, and confirmation');
    await expect(finalCta.getByRole('link', {name: 'Continue to the LF membership form'})).toHaveAttribute(
      'href',
      enrollmentUrl,
    );
    await expect(finalCta.getByRole('link', {name: 'Email the membership team'})).toHaveAttribute(
      'href',
      'mailto:membership@linuxfoundation.org',
    );
    await expect(page.getByText('Continue with the organization that manages enrollment.')).toHaveCount(0);
    await expect(page.getByText('Ready to discuss organizational membership?')).toHaveCount(0);
    expect(await page.getByRole('main').innerText()).not.toContain('—');
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
      await expect(page.locator('#final-cta').getByRole('link', {name: 'Email the membership team'})).toBeVisible();

      const widths = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
    });
  }

  test('presents current member proof, support, governance, and membership paths', async ({page}) => {
    await page.goto('/about/project-members/');

    await expect(page.getByRole('heading', {level: 1, name: 'Organizations sustaining the Xen Project.'})).toBeVisible();
    const hero = page.locator('#hero');
    await expect(hero.getByRole('link', {name: 'Explore membership'})).toHaveAttribute('href', '/about/become-a-member/');
    await expect(hero.getByRole('link', {name: 'Read project governance'})).toHaveAttribute('href', '/about/governance/');
    await expect(hero).toContainText(String(memberOrganizations.length));
    await expect(hero).toContainText('member organizations');
    await expect(hero).toContainText('One open source virtualization project.');

    const main = page.getByRole('main');
    await expect(main).not.toContainText(/shared data source|canonical source|database|dataset/i);

    const currentMembers = page.locator('#current-members');
    await expect(currentMembers.getByRole('heading', {level: 2, name: 'Current Xen Project members'})).toBeVisible();
    await expect(currentMembers).toContainText('Organizations providing sustained support for the project.');
    await expect(currentMembers.locator('img')).toHaveCount(memberOrganizations.length);

    for (const member of memberOrganizations) {
      const memberLink = currentMembers.getByRole('link', {name: `Visit ${member.name}`, exact: true});
      await expect(memberLink).toHaveAttribute('href', member.href);
      await expect(memberLink.locator('img')).toHaveAttribute('alt', member.name);
    }

    const support = page.locator('#what-support-enables');
    await expect(support.locator('article')).toHaveCount(4);
    for (const [title, description] of [
      ['Shared project infrastructure', 'Membership helps fund hosting, test environments, and operational resources used across the project.'],
      ['Events and coordination', 'Members support project events, communications, and collaboration across organizational boundaries.'],
      ['Trademark stewardship', 'The Advisory Board manages the Xen Project trademark and related non-technical responsibilities.'],
      ['Long-term project health', 'Sustained organizational participation supports shared programs and a neutral, open ecosystem.'],
    ]) {
      const card = support.locator('article').filter({hasText: title});
      await expect(card.getByRole('heading', {level: 3, name: title})).toBeVisible();
      await expect(card).toContainText(description);
    }
    await expect(support).not.toContainText(/pricing|enrollment|Premier Plus/i);

    const governance = page.locator('#governance-boundary');
    await expect(governance).toHaveCount(1);
    await expect(governance.getByRole('heading', {name: 'Member support and technical contribution are distinct.'})).toBeVisible();
    await expect(governance).toContainText('Membership supports the project; it does not buy code authority');
    await expect(governance.getByRole('link', {name: 'Read the governance model'})).toHaveAttribute('href', '/about/governance/');
    await expect(page.getByText('Membership supports the project; it does not buy code authority', {exact: true})).toHaveCount(1);

    const finalCta = page.locator('#final-cta');
    await expect(finalCta.getByRole('heading', {name: 'Add your organization to the project’s support network.'})).toBeVisible();
    await expect(finalCta.getByRole('link', {name: 'Explore Xen Project membership'})).toHaveAttribute(
      'href',
      '/about/become-a-member/',
    );
    await expect(finalCta.getByRole('link', {name: 'Read project governance'})).toHaveAttribute('href', '/about/governance/');
  });

  test('keeps project member proof readable at ordinary laptop width', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 800});
    await page.goto('/about/project-members/');

    await expect(page.locator('#hero').getByText('One open source virtualization project.')).toBeVisible();
    await expect(page.locator('#current-members img')).toHaveCount(memberOrganizations.length);
    await expect(page.locator('#what-support-enables article')).toHaveCount(4);
    await expect(page.locator('#final-cta').getByRole('link', {name: 'Explore Xen Project membership'})).toBeVisible();

    const widths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
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
      "'/about/governance/'",
    ]) {
      expect(source).toContain(route);
    }

    expect(source).toContain("localStorage.setItem('cookieConsent', 'false')");
    expect(source).toContain("name: 'tablet'");
  });
});
