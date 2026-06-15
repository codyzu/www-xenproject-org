import {expect, type Locator, type Page, test} from '@playwright/test';
import {migratedRoutes} from '../../scripts/astro/migrated-routes.ts';

const menuSections = [
  {
    name: 'Projects',
    href: '/projects/',
    children: [
      ['All projects', '/projects/all-projects/'],
      ['Hypervisor', '/projects/hypervisor/'],
      ['Embedded & Automotive', '/projects/embedded-and-automotive/'],
      ['HVMI', '/projects/hvmi/'],
      ['Mirage OS', '/projects/mirage-os/'],
      ['Unikraft', '/projects/unikraft/'],
      ['Windows PV Drivers', '/projects/windows-pv-drivers/'],
      ['XAPI', '/projects/xapi/'],
      ['XCP-ng', '/projects/xcp-ng/'],
    ],
  },
  {
    name: 'Contribute',
    href: '/contribute/',
    children: [
      ['Get started', '/contribute/get-started/'],
      ['Contribution guidelines', '/contribute/contribution-guidelines/'],
      ['Continuous Integration', '/contribute/ci/'],
      ['CI status dashboard', '/contribute/ci/status/'],
      ['Xen Project Code of Conduct', '/contribute/code-of-conduct/'],
    ],
  },
  {
    name: 'Resources',
    href: '/resources/',
    children: [
      ['Use cases', '/resources/use-cases/'],
      ['Xen Summit 2026', '/resources/summit-2026/'],
      ['Academic Research', '/research/'],
      ['Downloads', '/resources/downloads/'],
      ['Blog', '/blog'],
      ['Matrix', '/resources/matrix/'],
      ['Past Events', '/resources/past-events/'],
      ['Join mailing lists', '/resources/mailing-lists/'],
    ],
  },
  {
    name: 'About',
    href: '/about',
    children: [
      ['About Xen Project', '/about/'],
      ['Xen Project members', '/about/project-members/'],
      ['Become a member', '/about/become-a-member/'],
      ['Governance', '/about/governance/'],
      ['Security policy', '/about/security-policy/'],
      ['Contact us', '/about/contact-us/'],
    ],
  },
];

const topLevelMenuItem = (page: Page, name: string) =>
  page.locator('header .header-nav > ul.menu > li').filter({
    has: page.locator('> a', {hasText: name}),
  });

const topLevelLink = (item: Locator, name: string) =>
  item.locator('> a').filter({hasText: name});

test.describe('Astro spike navigation shell', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/about/contact-us/');
  });

  test('exposes the desktop navigation contract', async ({page}) => {
    await expect(page.locator('header')).toBeVisible();

    for (const section of menuSections) {
      const item = topLevelMenuItem(page, section.name);
      const link = topLevelLink(item, section.name);

      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', section.href);

      await item.hover();

      for (const [name, href] of section.children) {
        const childLink = item.locator('ul a', {hasText: name});
        await expect(childLink).toBeVisible();
        await expect(childLink).toHaveAttribute('href', href);
      }
    }

    const documentationLink = page.locator('header .header-nav > ul.menu > li > a', {
      hasText: 'Documentation',
    });
    await expect(documentationLink).toBeVisible();
    await expect(documentationLink).toHaveAttribute('href', 'https://wiki.xenproject.org/');
    await expect(documentationLink).toHaveAttribute('target', '_blank');
  });

  test('marks the current page and ancestor in the desktop navigation', async ({page}) => {
    const aboutItem = topLevelMenuItem(page, 'About');
    await expect(topLevelLink(aboutItem, 'About')).toHaveAttribute('aria-current', 'true');
    await expect(aboutItem.locator('ul a', {hasText: 'Contact us'})).toHaveAttribute('aria-current', 'page');
  });

  test('opens and closes desktop submenus from the keyboard', async ({page}) => {
    const contributeItem = topLevelMenuItem(page, 'Contribute');
    const contributeLink = topLevelLink(contributeItem, 'Contribute');
    const childLink = contributeItem.locator('ul a', {hasText: 'Contribution guidelines'});

    await expect(childLink).not.toBeVisible();
    await contributeLink.focus();
    await page.keyboard.press('Enter');
    await expect(childLink).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(childLink).not.toBeVisible();
  });

  test('opens the mobile menu and verifies first-level child links', async ({page}) => {
    await page.setViewportSize({width: 390, height: 900});
    await page.reload();

    for (const section of menuSections) {
      await page.goto('/about/contact-us/');
      await page.setViewportSize({width: 390, height: 900});

      const header = page.locator('header');
      const item = topLevelMenuItem(page, section.name);
      const link = topLevelLink(item, section.name);

      await expect(page.locator('header .header-content')).not.toBeVisible();
      await page.locator('header .menu-toggle').click();
      await expect(header).toHaveClass(/active/);
      await expect(page.locator('header .header-content')).toBeVisible();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', section.href);

      await link.click();
      await expect(page).toHaveURL(/\/about\/contact-us\/$/);
      await expect(item).toHaveClass(/active/);

      for (const [name, href] of section.children) {
        const childLink = item.locator('ul a', {hasText: name});
        await expect(childLink).toBeVisible();
        await expect(childLink).toHaveAttribute('href', href);
      }

      await page.locator('header .menu-toggle').click();
      await expect(header).not.toHaveClass(/active/);
    }
  });

  for (const route of migratedRoutes) {
    test(`renders migrated route shell for ${route}`, async ({page}) => {
      await page.goto(route);

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.getByRole('heading', {name: /404/i})).toHaveCount(0);
    });
  }
});
