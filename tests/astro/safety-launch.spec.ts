import process from 'node:process';
import AxeBuilder from '@axe-core/playwright';
import {expect, type Page, test} from '@playwright/test';

const homepageDescription = 'The Xen Project develops an open source hypervisor for infrastructure, embedded, security-sensitive, and virtualization platforms that need clear separation and long-term control.';
const safetyDescription = 'Explore how the Xen Safety Committee and Premier Plus membership support certification-oriented engineering with shared requirements, tests, tooling, evidence, and process documentation.';
const membershipDescription = 'Explore Xen Project organizational membership, including Premier Plus participation in the Xen Safety Committee, and continue to Linux Foundation enrollment.';
const governanceDescription = 'Learn how the Xen Project governs open technical decisions, project roles, the Advisory Board, and Safety Committee coordination.';
const siteUrl = new URL(process.env.SITE_URL ?? 'https://beta.xenproject.org');

const expectNoHorizontalOverflow = async (page: Page) => {
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
};

test.describe('Safety launch integration', () => {
  test('presents the homepage launch section in the intended narrative position', async ({page}) => {
    await page.goto('/');

    const section = page.locator('#safety-initiative');
    await expect(section.getByText('New safety initiative', {exact: true})).toBeVisible();
    await expect(section.getByRole('heading', {level: 2, name: 'Open source safety engineering, built together.'})).toBeVisible();
    await expect(section).toContainText('Premier Plus members a maintained foundation');
    await expect(section).toContainText('substantial head start');
    await expect(section).not.toContainText(/80\s*(?:percent|%)|mostly complete/i);
    await expect(section.getByRole('link', {name: 'Explore safety engineering'})).toHaveAttribute('href', '/technology/safety/');
    await expect(section.getByRole('link', {name: 'Learn about Premier Plus'})).toHaveAttribute('href', '/about/become-a-member/');
    await expect(section.getByRole('heading', {level: 3})).toHaveText([
      'Safety Committee',
      'Shared foundation',
      'Premier Plus participation',
    ]);

    const order = await page.locator('#evidence-in-use, #safety-initiative, #members').evaluateAll(
      elements => elements.map(element => element.id),
    );
    expect(order).toEqual(['evidence-in-use', 'safety-initiative', 'members']);
    await expectNoHorizontalOverflow(page);
  });

  test('states the approved Safety Committee, contributor, and certification facts', async ({page}) => {
    await page.goto('/technology/safety/');

    const committee = page.locator('#safety-committee');
    await expect(committee.getByRole('heading', {
      name: 'The Xen Safety Committee coordinates certification-oriented work.',
    })).toBeVisible();
    await expect(committee).toContainText('defines processes for an auditable code base');
    await expect(committee).toContainText('Xen source code, licensing, and established development flows remain open and unchanged');
    await expect(committee).toContainText('appoint voting representatives to the Xen Project Advisory Board and the Safety Committee');
    await expect(committee).toContainText('help set priorities and roadmap');
    await expect(committee).toContainText('may disclose those artifacts to qualified safety assessors');
    await expect(committee).toContainText('AMD, EPAM, and Renesas');
    await expect(committee).toContainText('QEMU-based fault injection and component testing');

    const participation = page.locator('#participation');
    await expect(participation).toContainText('Rather than starting from zero');
    await expect(participation).toContainText('substantial head start');
    await expect(participation).toContainText('inputs to each organization’s own assessment, certification, audit, and safety case');
    await expect(participation).toContainText('They are not a complete product certification');

    const qualification = page.locator('#architecture-and-evidence');
    await expect(qualification).toContainText(
      'Xen source code is not itself safety certified. Certification depends on the complete system, integration context, process, evidence, tooling, validation, and safety case.',
    );

    const evidence = page.locator('#evidence-tooling');
    await expect(evidence).toContainText('BUGSENG');
    await expect(evidence).toContainText('ECLAIR static analysis');
    await expect(evidence).toContainText('MISRA C compliance efforts');
    await expect(evidence).toContainText('Automotive Grade Linux');
    await expect(evidence).toContainText('Linux and Zephyr platform composition');
    await expect(page.getByRole('main')).not.toContainText(/Xen is (?:fully )?MISRA compliant|ECLAIR certifies Xen|Xen is safety certified/i);
    await expect(page.getByRole('main')).not.toContainText(/80\s*(?:percent|%)|mostly complete|pre-certified|certification-ready/i);

    const finalCta = page.locator('#final-cta');
    await expect(finalCta.getByRole('link', {name: 'Explore Premier Plus membership'})).toHaveAttribute(
      'href',
      '/about/become-a-member/',
    );
    await expect(finalCta.getByRole('link', {name: 'Review project governance'})).toHaveAttribute(
      'href',
      '/about/governance/',
    );
    await expectNoHorizontalOverflow(page);
  });

  test('integrates concise Safety Committee context into Governance', async ({page}) => {
    await page.goto('/about/governance/');

    const heading = page.getByRole('heading', {level: 3, name: 'Xen Safety Committee'});
    await expect(heading).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/xp-longform-page/);
    await expect(page.locator('header nav[aria-label="Primary navigation"]')).toBeVisible();
    await expect(page.locator('footer nav[aria-label="Footer navigation"]')).toBeVisible();
    const prose = page.locator('.xen-prose-dark');
    await expect(prose).toHaveCount(1);
    await expect(prose).toHaveCSS('max-width', 'none');
    await expect(page.locator('header .header-nav')).toHaveCount(0);
    const governanceContent = page.getByRole('main');
    await expect(governanceContent).toContainText('formal project committee');
    await expect(governanceContent).toContainText('appoint voting representatives to both the Xen Project Advisory Board and the Safety Committee');
    await expect(governanceContent).toContainText('Upstream technical decisions continue through Xen');
    await expect(governanceContent).toContainText('The committee does not replace maintainer review');
    await expect(governanceContent).toContainText('membership does not confer technical authority');
    await expect(page.getByRole('link', {name: 'Explore safety engineering'})).toHaveAttribute('href', '/technology/safety/');
    await expect(page.getByRole('link', {name: 'explore Premier Plus membership'})).toHaveAttribute(
      'href',
      '/about/become-a-member/',
    );
    await expectNoHorizontalOverflow(page);

    const accessibility = await new AxeBuilder({page}).include('main').analyze();
    const seriousViolations = accessibility.violations.filter(
      violation => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(seriousViolations).toEqual([]);
  });

  test('exposes launch-specific metadata and canonical URLs', async ({page}) => {
    for (const [path, title, description] of [
      ['/', 'Xen Project', homepageDescription],
      ['/technology/safety/', 'Safety-Critical Systems', safetyDescription],
      ['/about/become-a-member/', 'Become a member', membershipDescription],
      ['/about/governance/', 'Governance', governanceDescription],
    ] as const) {
      await page.goto(path);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/.+/);
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /^https:\/\/.+/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new URL(path, siteUrl).toString());
    }
  });

  for (const viewport of [
    {name: 'wide desktop', width: 1440, height: 1000},
    {name: 'ordinary laptop', width: 1280, height: 800},
    {name: 'iPad landscape', width: 1024, height: 768},
    {name: 'iPad portrait', width: 834, height: 1194},
    {name: 'narrow mobile', width: 360, height: 800},
  ]) {
    test(`keeps the launch journey readable at ${viewport.name}`, async ({page}) => {
      await page.setViewportSize({width: viewport.width, height: viewport.height});

      for (const path of ['/', '/technology/safety/', '/about/become-a-member/', '/about/project-members/', '/about/governance/']) {
        const response = await page.goto(path);
        expect(response?.ok()).toBe(true);
        await expect(page.getByRole('heading', {level: 1})).toBeVisible();
        expect(await page.getByRole('main').innerText()).not.toContain('—');
        await expect(page.getByRole('main')).not.toContainText(/80\s*(?:percent|%)\s+(?:of\s+)?(?:certification|foundational|safety)|mostly complete/i);
        await expectNoHorizontalOverflow(page);
      }
    });
  }
});
