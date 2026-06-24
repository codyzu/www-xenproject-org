import {expect, type Page, test} from '@playwright/test';
import {memberLogos} from '../../src/data/member-logos';
import {projects} from '../../src/data/projects';

const featuredProjectNames = ['Hypervisor', 'Embedded & Automotive', 'HVMI', 'XAPI', 'XCP-ng', 'Mirage OS'];
const featuredProjects = projects.filter(project => featuredProjectNames.includes(project.title));

async function prepareHomepage(page: Page) {
  await page.goto('/');
  await page.evaluate(async () => document.fonts.ready);
}

test.describe('redesigned homepage', () => {
  test('renders the design-system homepage narrative without retired homepage patterns', async ({page}) => {
    await prepareHomepage(page);
    const main = page.locator('main');

    await expect(main.getByRole('heading', {
      level: 1,
      name: 'Open source virtualization for systems that demand isolation and control.',
    })).toBeVisible();
    await expect(main.getByText('Xen is a hypervisor and open source project')).toBeVisible();
    await expect(main.getByRole('link', {name: 'Explore Xen'})).toHaveAttribute('href', '/projects/hypervisor/');
    await expect(main.getByRole('link', {name: 'Explore membership'}).first()).toHaveAttribute('href', '/about/become-a-member/');

    await expect(main.getByRole('heading', {name: 'A project you can evaluate in the open.'})).toBeVisible();
    await expect(main.getByRole('link', {name: 'Governance', exact: true})).toHaveAttribute('href', '/about/governance/');
    await expect(main.getByRole('link', {name: 'Security policy', exact: true})).toHaveAttribute('href', '/about/security-policy/');
    await expect(main.getByRole('link', {name: 'CI resources', exact: true})).toHaveAttribute('href', '/contribute/ci/');

    await expect(main.getByRole('heading', {name: 'Modern platforms still need a strong virtualization layer.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Built for engineers working close to the platform.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'A clear boundary for platform control.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Explore the Xen project ecosystem.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Sustained by organizations with a stake in open virtualization.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Technical work happens in the open.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: "Support Xen's future, or help build it."})).toBeVisible();

    await expect(page.locator('#xen-story')).toHaveCount(0);
    await expect(page.locator('[data-project-carousel]')).toHaveCount(0);
    await expect(page.locator('#logo-wheel')).toHaveCount(0);
    await expect(page.locator('[data-latest-news]')).toHaveCount(0);
    await expect(page.getByRole('heading', {name: /404/i})).toHaveCount(0);
  });

  test('renders member logos from shared data and static project links from project data', async ({page}) => {
    await prepareHomepage(page);
    const main = page.locator('main');

    await expect(main.locator('#members img')).toHaveCount(memberLogos.length);
    for (const logo of memberLogos) {
      await expect(main.getByRole('link', {name: `Visit ${logo.label}`})).toHaveAttribute('href', logo.href);
      await expect(main.locator(`#members img[alt="${logo.label}"]`)).toHaveAttribute('src', logo.src);
    }

    for (const project of featuredProjects) {
      const projectCard = main.getByRole('heading', {name: project.title}).locator('..').locator('..');
      await expect(projectCard.getByText(project.description)).toBeVisible();
      await expect(projectCard.getByRole('link', {name: 'Open project'})).toHaveAttribute('href', project.route);
    }
  });

  test('uses the clean public shell and mobile navigation without duplicating navigation data', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await prepareHomepage(page);

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('link', {name: 'Xen Project home'})).toHaveAttribute('href', '/');

    const menu = page.locator('summary', {hasText: 'Menu'});
    await expect(menu).toBeVisible();
    await menu.click();

    const mobileNav = page.getByRole('navigation', {name: 'Mobile navigation'});
    await expect(mobileNav.getByRole('link', {name: 'Projects', exact: true})).toHaveAttribute('href', '/projects/');
    await expect(mobileNav.getByRole('link', {name: 'Become a member'}).last()).toHaveAttribute('href', '/about/become-a-member/');
  });

  test('keeps keyboard focus visible on homepage actions', async ({page}) => {
    await prepareHomepage(page);

    const action = page.getByRole('link', {name: 'Explore Xen'});
    await action.focus();
    await expect(action).toBeFocused();

    const focusStyle = await action.evaluate(element => {
      const style = getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });

    expect(focusStyle.outlineStyle).not.toBe('none');
    expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThan(0);
  });
});
