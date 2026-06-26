import {expect, type Page, test} from '@playwright/test';
import {memberLogos} from '../../src/data/member-logos';
import {navigationV2Sections} from '../../src/data/navigation-v2';
import {projects} from '../../src/data/projects';

const featuredProjectNames = ['Hypervisor', 'Embedded & Automotive', 'HVMI', 'XAPI', 'XCP-ng', 'Mirage OS'];
const featuredProjects = projects.filter(project => featuredProjectNames.includes(project.title));

async function prepareHomepage(page: Page) {
  await page.goto('/');
  await page.evaluate(async () => document.fonts.ready);
}

const groupedNavigationLinks = navigationV2Sections.flatMap(section =>
  section.groups?.flatMap(group => group.links.map(link => ({...link, section: section.name}))) ?? [],
);

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
    await expect(page.getByRole('contentinfo').getByRole('link', {name: 'Become a member'})).toHaveAttribute('href', '/about/become-a-member/');

    const menu = page.getByRole('button', {name: 'Toggle mobile navigation'});
    await expect(menu).toBeVisible();
    await menu.click();

    const mobileNav = page.getByRole('navigation', {name: 'Mobile navigation'});
    await mobileNav.locator('summary', {hasText: 'Projects'}).click();
    await expect(mobileNav.getByRole('link', {name: 'Projects overview'})).toHaveAttribute('href', '/projects/');
    await expect(mobileNav.getByRole('link', {name: 'Become a member'}).last()).toHaveAttribute('href', '/about/become-a-member/');
  });

  test('exposes v2 desktop navigation through accessible popovers', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 900});
    await prepareHomepage(page);

    const primaryNav = page.getByRole('navigation', {name: 'Primary navigation'});
    for (const [index, item] of navigationV2Sections.entries()) {
      await expect(primaryNav.getByRole('link', {name: item.name, exact: true})).toHaveAttribute('href', item.href);
      await primaryNav.getByRole('link', {name: item.name, exact: true}).hover();
      const popover = page.locator(`#xp-nav-popover-${index}`);
      await expect(popover).toBeVisible();

      for (const group of item.groups ?? []) {
        for (const link of group.links) {
          await expect(popover.getByRole('link', {name: link.name}).first()).toHaveAttribute('href', link.href);
        }
      }
    }

    await primaryNav.getByRole('link', {name: 'Technology', exact: true}).hover();
    await expect(page.locator('#xp-nav-popover-0')).toBeVisible();
    await page.mouse.move(20, 500);
    const technologyPopover = page.locator('#xp-nav-popover-0');
    await expect(technologyPopover).not.toBeVisible();

    await page.getByRole('button', {name: 'Open Developers navigation'}).click();
    const developersPopover = page.locator('#xp-nav-popover-2');
    await expect(developersPopover).toBeVisible();
    const documentationLink = developersPopover.getByRole('link', {name: 'Documentation'});
    await expect(documentationLink).toHaveAttribute('href', 'https://wiki.xenproject.org/');
    await expect(documentationLink).toHaveAttribute('target', '_blank');
    await expect(page.getByRole('banner').getByRole('link', {name: 'Become a member'})).toHaveAttribute('href', '/about/become-a-member/');

    await page.locator('main').click({position: {x: 20, y: 20}});
    await expect(developersPopover).not.toBeVisible();
  });

  test('keeps desktop labels as landing links and chevrons as disclosure controls', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 900});
    await prepareHomepage(page);

    await page.getByRole('navigation', {name: 'Primary navigation'}).getByRole('link', {name: 'Technology', exact: true}).click();
    await expect(page).toHaveURL(/\/technology\/$/);

    await prepareHomepage(page);
    const technologyToggle = page.getByRole('button', {name: 'Open Technology navigation'});
    await technologyToggle.hover();
    await expect(page.locator('#xp-nav-popover-0')).toBeVisible();

    await technologyToggle.click();
    await expect(page.locator('#xp-nav-popover-0')).not.toBeVisible();
    await expect(page).toHaveURL(/\/$/);

    await page.mouse.move(20, 500);
    await technologyToggle.dispatchEvent('click');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#xp-nav-popover-0')).toBeVisible();
  });

  test('supports desktop keyboard disclosure and focus return', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 900});
    await prepareHomepage(page);

    const technologyLink = page.getByRole('navigation', {name: 'Primary navigation'}).getByRole('link', {name: 'Technology', exact: true});
    await technologyLink.focus();
    await page.keyboard.press('ArrowDown');

    const technologyPopover = page.locator('#xp-nav-popover-0');
    await expect(technologyPopover).toBeVisible();
    await expect(technologyPopover.getByRole('link', {name: 'Technology', exact: true})).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(technologyPopover).not.toBeVisible();
    await expect(technologyLink).toBeFocused();

    const developersToggle = page.getByRole('button', {name: 'Open Developers navigation'});
    await developersToggle.focus();
    await page.keyboard.press(' ');
    const developersPopover = page.locator('#xp-nav-popover-2');
    await expect(developersPopover).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(developersPopover).not.toBeVisible();
    await expect(developersToggle).toBeFocused();
  });

  test('exposes v2 mobile navigation through details accordions', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await prepareHomepage(page);
    await page.evaluate(() => globalThis.scrollTo(0, 240));

    await page.getByRole('button', {name: 'Toggle mobile navigation'}).click();
    const mobileNav = page.getByRole('navigation', {name: 'Mobile navigation'});
    await expect(mobileNav).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('position', 'fixed');
    await expect(page.locator('body')).toHaveCSS('top', '-240px');

    await mobileNav.locator('summary', {hasText: 'Technology'}).click();
    await expect(mobileNav.getByRole('link', {name: 'Technology overview'})).toHaveAttribute('href', '/technology/');
    await expect(mobileNav.getByRole('link', {name: 'Architecture'})).toHaveAttribute('href', '/technology/architecture/');
    await expect(mobileNav.getByRole('link', {name: 'Safety-critical systems'})).toHaveAttribute('href', '/technology/safety/');
    await expect(mobileNav.locator('details[data-mobile-nav-section][open]')).toHaveCount(1);

    await mobileNav.locator('summary', {hasText: 'Developers'}).click();
    await expect(mobileNav.locator('details[data-mobile-nav-section][open]')).toHaveCount(1);
    const technologyIsOpen = await mobileNav.locator('summary', {hasText: 'Technology'}).evaluate(summary =>
      summary.parentElement?.hasAttribute('open') ?? false,
    );
    expect(technologyIsOpen).toBe(false);
    const documentationLink = mobileNav.getByRole('link', {name: 'Documentation'}).first();
    await expect(documentationLink).toHaveAttribute('href', 'https://wiki.xenproject.org/');
    await expect(documentationLink).toHaveAttribute('target', '_blank');
    await expect(mobileNav.getByRole('link', {name: 'Start contributing'}).first()).toHaveAttribute('href', '/contribute/get-started/');
    await expect(mobileNav.getByRole('link', {name: 'Become a member'}).last()).toHaveAttribute('href', '/about/become-a-member/');

    for (const section of navigationV2Sections) {
      const sectionSummary = mobileNav.locator('summary', {hasText: section.name});
      if (await sectionSummary.count() > 0) {
        const isOpen = await sectionSummary.evaluate((summary) => summary.parentElement?.hasAttribute('open') ?? false);
        if (!isOpen) {
          await sectionSummary.click();
        }
      }

      await expect(mobileNav.locator('details[data-mobile-nav-section][open]')).toHaveCount(1);

      for (const link of groupedNavigationLinks.filter(link => link.section === section.name)) {
        await expect(mobileNav.getByRole('link', {name: link.name}).first()).toHaveAttribute('href', link.href);
      }
    }

    await page.keyboard.press('Escape');
    await expect(mobileNav).not.toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
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
