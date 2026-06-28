import {expect, type Page, test} from '@playwright/test';
import {memberLogos} from '../../src/data/member-logos';
import {navigationV2Sections} from '../../src/data/navigation-v2';
import {projects} from '../../src/data/projects';

const featuredProjectNames = ['Hypervisor', 'Embedded & Automotive', 'HVMI', 'XAPI', 'XCP-ng', 'Mirage OS'];
const featuredProjects = projects.filter(project => featuredProjectNames.includes(project.title));
const heroIllustrationViewports = [
  {name: 'laptop', width: 1280, height: 900},
  {name: 'desktop', width: 1440, height: 1000},
  {name: 'large desktop', width: 1600, height: 1000},
  {name: 'ultrawide', width: 2560, height: 1080},
  {name: 'iPad landscape', width: 1024, height: 768},
  {name: 'iPad portrait', width: 834, height: 1194},
];

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
    await expect(main.getByRole('img', {
      name: 'Exploded Xen architecture scene showing applications above guest systems, a thin luminous Xen hypervisor layer, and a substantial hardware platform foundation.',
    })).toBeVisible();
    const heroScene = main.locator('[data-hero-layered-platform]');
    await expect(heroScene).toBeVisible();
    await expect(heroScene.locator('[data-platform-layer="applications"]')).toHaveAttribute('data-platform-layer-asset', 'image');
    await expect(heroScene.locator('[data-platform-layer="guest-systems"]')).toHaveAttribute('data-platform-layer-asset', 'image');
    await expect(heroScene.locator('[data-platform-layer="xen-hypervisor"]')).toHaveAttribute('data-platform-layer-asset', 'image');
    await expect(heroScene.locator('[data-platform-layer="hardware"]')).toHaveAttribute('data-platform-layer-asset', 'image');
    await expect(heroScene.locator('[data-platform-layer] img')).toHaveCount(4);
    await expect(heroScene.locator('[data-platform-layer="xen-hypervisor"] img')).toHaveAttribute('alt', '');
    await expect(heroScene.locator('.hero-layered-platform__label--xen-hypervisor')).toContainText('Xen hypervisor');
    await expect(heroScene.locator('.hero-layered-platform__label--hardware')).toContainText('Hardware');
    await expect(heroScene.locator('.hero-layered-platform__label--applications .i-carbon-application-web')).toBeVisible();
    await expect(heroScene.locator('.hero-layered-platform__label--guest-systems .i-carbon-virtual-machine')).toBeVisible();
    await expect(heroScene.locator('.hero-layered-platform__label--hardware .i-carbon-chip')).toBeVisible();
    await expect(heroScene.locator('.hero-layered-platform__label--xen-hypervisor .hero-layered-platform__xen-mark')).toBeVisible();
    await expect(heroScene.locator('[data-platform-layer]')).toHaveCount(4);
    const paintedLayerOrder = await heroScene.locator('[data-platform-layer]').evaluateAll(elements =>
      elements.map(element => element.getAttribute('data-platform-layer')),
    );
    expect(paintedLayerOrder).toEqual(['hardware', 'xen-hypervisor', 'guest-systems', 'applications']);

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

  test('keeps the layered platform illustration responsive on mobile and reduced motion', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await prepareHomepage(page);

    const diagram = page.locator('[data-hero-layered-platform]');
    await expect(diagram).toBeVisible();

    const box = await diagram.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);

    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.reload();
    await page.evaluate(async () => document.fonts.ready);

    await expect(diagram).toBeVisible();
    const animationName = await page.locator('.hero-layered-platform__stack').evaluate(element => getComputedStyle(element).animationName);
    expect(animationName).toBe('none');
    await expect(diagram.locator('[data-platform-layer] img')).toHaveCount(4);
  });

  test('keeps the layered platform artwork visible and label connectors registered', async ({page}) => {
    for (const viewport of heroIllustrationViewports) {
      await page.setViewportSize({width: viewport.width, height: viewport.height});
      await prepareHomepage(page);

      const diagram = page.locator('[data-hero-layered-platform]');
      await expect(diagram, viewport.name).toBeVisible();

      const geometry = await diagram.evaluate(element => {
        const toPixels = (value: string, basis: number) => {
          const trimmed = value.trim();
          if (trimmed.endsWith('rem')) {
            return Number.parseFloat(trimmed) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
          }

          if (trimmed.endsWith('%')) {
            return Number.parseFloat(trimmed) * basis / 100;
          }

          return Number.parseFloat(trimmed) || 0;
        };

        const diagramRect = element.getBoundingClientRect();
        const stageStyle = getComputedStyle(element);
        const layerGeometry = [...element.querySelectorAll<HTMLElement>('[data-platform-layer]')].map(layer => {
          const rect = layer.getBoundingClientRect();
          const layerStyle = getComputedStyle(layer);
          const visibleRightInset = toPixels(layerStyle.getPropertyValue('--visible-right-inset'), rect.width);

          return {
            key: layer.dataset.platformLayer,
            left: rect.left,
            right: rect.right,
            visibleRight: rect.right - visibleRightInset,
            width: rect.width,
            centerY: rect.top + rect.height / 2,
          };
        });
        const labelGeometry = [...element.querySelectorAll<HTMLElement>('.hero-layered-platform__label')].flatMap(label => {
          const labelRect = label.getBoundingClientRect();
          if (labelRect.width === 0 || labelRect.height === 0) {
            return [];
          }

          const connector = label.querySelector<SVGElement>('.hero-layered-platform__connector');
          const connectorRect = connector?.getBoundingClientRect();
          const layerNode = label.querySelector<HTMLElement>('.hero-layered-platform__connector-node--layer');
          const layerNodeRect = layerNode?.getBoundingClientRect();
          const icon = label.querySelector<HTMLElement>('.hero-layered-platform__icon');
          const iconRect = icon?.getBoundingClientRect();
          const description = label.querySelector<HTMLElement>('small');
          const descriptionStyle = description ? getComputedStyle(description) : undefined;

          return [{
            key: [...label.classList].find(className => className.startsWith('hero-layered-platform__label--'))?.replace('hero-layered-platform__label--', ''),
            left: labelRect.left,
            iconLeft: iconRect?.left ?? 0,
            centerY: labelRect.top + labelRect.height / 2,
            connectorLeft: connectorRect?.left ?? 0,
            connectorRight: connectorRect?.right ?? 0,
            connectorWidth: connectorRect?.width ?? 0,
            layerNodeLeft: layerNodeRect?.left ?? 0,
            layerNodeRight: layerNodeRect?.right ?? 0,
            layerNodeCenter: layerNodeRect ? layerNodeRect.left + layerNodeRect.width / 2 : 0,
            descriptionFontSize: descriptionStyle ? Number.parseFloat(descriptionStyle.fontSize) : 0,
            descriptionLineHeight: descriptionStyle ? Number.parseFloat(descriptionStyle.lineHeight) : 0,
          }];
        });
        const guideHost = element.querySelector<HTMLElement>('.hero-layered-platform__guides');
        const guideHostRect = guideHost?.getBoundingClientRect();
        const guideGeometry = [...element.querySelectorAll<HTMLElement>('.hero-layered-platform__guides span')].map(guide => {
          const rect = guide.getBoundingClientRect();
          return rect.left + rect.width / 2;
        });
        const expectedGuideGeometry = guideHostRect ? [
          guideHostRect.left + toPixels(stageStyle.getPropertyValue('--stage-standoff-left-x'), guideHostRect.width),
          guideHostRect.left + toPixels(stageStyle.getPropertyValue('--stage-standoff-right-x'), guideHostRect.width),
        ] : [];

        return {
          diagramLeft: diagramRect.left,
          diagramRight: diagramRect.right,
          layerGeometry,
          labelGeometry,
          guideGeometry,
          expectedGuideGeometry,
        };
      });

      expect(geometry.diagramLeft, `${viewport.name}: diagram left edge`).toBeGreaterThanOrEqual(0);
      expect(geometry.diagramRight, `${viewport.name}: diagram right edge`).toBeLessThanOrEqual(viewport.width);

      for (const layer of geometry.layerGeometry) {
        expect(layer.left, `${viewport.name}: ${layer.key} left edge`).toBeGreaterThanOrEqual(geometry.diagramLeft - 1);
        expect(layer.right, `${viewport.name}: ${layer.key} right edge`).toBeLessThanOrEqual(geometry.diagramRight + 1);
      }

      if (geometry.labelGeometry.length > 0) {
        expect(geometry.guideGeometry, `${viewport.name}: guide count`).toHaveLength(2);
        expect(geometry.expectedGuideGeometry, `${viewport.name}: expected guide count`).toHaveLength(2);
        for (const [index, guideX] of geometry.guideGeometry.entries()) {
          expect(Math.abs(guideX - geometry.expectedGuideGeometry[index]!), `${viewport.name}: guide follows standoff variable ${index}`).toBeLessThanOrEqual(1);
        }

        const widestLayer = geometry.layerGeometry.reduce((widest, layer) => layer.width > widest.width ? layer : widest);
        for (const guideX of geometry.guideGeometry) {
          expect(guideX, `${viewport.name}: guide inside artwork left`).toBeGreaterThan(widestLayer.left);
          expect(guideX, `${viewport.name}: guide inside artwork right`).toBeLessThan(widestLayer.right);
        }

        const guideSeparation = geometry.guideGeometry[1] - geometry.guideGeometry[0];
        expect(guideSeparation, `${viewport.name}: guide construction columns separated`).toBeGreaterThan(widestLayer.width * 0.38);
        expect(guideSeparation, `${viewport.name}: guide construction columns contained`).toBeLessThan(widestLayer.width * 0.58);
      }

      for (const label of geometry.labelGeometry) {
        const layer = geometry.layerGeometry.find(candidate => candidate.key === label.key);
        expect(layer, `${viewport.name}: ${label.key} layer`).toBeDefined();
        expect(Math.abs(label.centerY - layer!.centerY), `${viewport.name}: ${label.key} connector center`).toBeLessThanOrEqual(3);
        expect(label.iconLeft, `${viewport.name}: ${label.key} label stays close to visible layer`).toBeLessThanOrEqual(layer!.visibleRight + 72);
        expect(label.iconLeft, `${viewport.name}: ${label.key} label avoids visible layer overlap`).toBeGreaterThan(layer!.visibleRight + 28);
        expect(label.connectorWidth, `${viewport.name}: ${label.key} connector reaches visible geometry`).toBeGreaterThanOrEqual(26);
        expect(label.connectorWidth, `${viewport.name}: ${label.key} connector remains compact`).toBeLessThanOrEqual(68);
        expect(Math.abs(label.layerNodeCenter - layer!.visibleRight), `${viewport.name}: ${label.key} endpoint lands on visible layer`).toBeLessThanOrEqual(4.5);
        expect(label.layerNodeLeft, `${viewport.name}: ${label.key} endpoint does not float away from visible edge`).toBeLessThanOrEqual(layer!.visibleRight + 4);
        expect(label.layerNodeRight, `${viewport.name}: ${label.key} endpoint reaches visible edge`).toBeGreaterThanOrEqual(layer!.visibleRight - 8);
        expect(label.connectorRight, `${viewport.name}: ${label.key} connector avoids label`).toBeLessThanOrEqual(label.left - 4);
        expect(label.descriptionFontSize, `${viewport.name}: ${label.key} readable description size`).toBeGreaterThanOrEqual(10.5);
        expect(label.descriptionLineHeight, `${viewport.name}: ${label.key} readable description line height`).toBeGreaterThan(label.descriptionFontSize);
      }
    }
  });
});
