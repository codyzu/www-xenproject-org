import process from 'node:process';
import AxeBuilder from '@axe-core/playwright';
import {expect, type Browser, type BrowserContext, type BrowserContextOptions, type Locator, type Page} from '@playwright/test';

type ActionContract = {
  href: string;
  label: string;
};

type DiagramContract = {
  layers: string[];
  title: string;
  variant: 'hero' | 'standard';
};

export type HighValuePageContract = {
  diagrams: DiagramContract[];
  finalActions: ActionContract[];
  finalCta: string;
  heading: string;
  heroActions: ActionContract[];
  keyHeading: string;
  name: string;
  path: string;
  title: string;
};

export type ViewportProfile = {
  name: 'desktop' | 'ipad-landscape' | 'ipad-portrait' | 'mobile';
  options: BrowserContextOptions;
  stackedHero: boolean;
};

export const chromiumProfiles: ViewportProfile[] = [
  {
    name: 'desktop',
    options: {viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce'},
    stackedHero: false,
  },
  {
    name: 'ipad-landscape',
    options: {viewport: {width: 1024, height: 768}, hasTouch: true, isMobile: false, reducedMotion: 'reduce'},
    stackedHero: false,
  },
  {
    name: 'ipad-portrait',
    options: {viewport: {width: 834, height: 1194}, hasTouch: true, isMobile: false, reducedMotion: 'reduce'},
    stackedHero: true,
  },
  {
    name: 'mobile',
    options: {viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true, reducedMotion: 'reduce'},
    stackedHero: true,
  },
];

export const highValuePages: HighValuePageContract[] = [
  {
    name: 'homepage',
    path: '/',
    title: 'Xen Project - Open Source Virtualization',
    heading: 'Open source virtualization for systems that demand isolation and control.',
    keyHeading: 'A project you can evaluate in the open.',
    finalCta: '#next-step',
    heroActions: [
      {label: 'Explore the hypervisor', href: '/projects/hypervisor/'},
      {label: 'Explore membership', href: '/about/become-a-member/'},
    ],
    finalActions: [
      {label: 'Explore membership', href: '/about/become-a-member/'},
      {label: 'Start contributing', href: '/contribute/get-started/'},
    ],
    diagrams: [],
  },
  {
    name: 'embedded',
    path: '/projects/embedded-and-automotive/',
    title: 'Embedded & Automotive | Xen Project',
    heading: 'Open source virtualization for embedded and automotive systems.',
    keyHeading: 'Consolidate the platform without blurring the boundaries.',
    finalCta: '#next-step',
    heroActions: [
      {label: 'Explore architecture', href: '/technology/architecture/'},
      {label: 'Start contributing', href: '/contribute/get-started/'},
    ],
    finalActions: [
      {label: 'Start contributing', href: '/contribute/get-started/'},
      {label: 'Become a member', href: '/about/become-a-member/'},
    ],
    diagrams: [
      {
        title: 'Mixed-criticality platform',
        variant: 'hero',
        layers: ['Applications', 'Guest systems', 'Xen hypervisor', 'Hardware platform'],
      },
      {
        title: 'Open platform composition',
        variant: 'standard',
        layers: ['Vehicle applications and services', 'Guest systems', 'Xen virtualization', 'Hardware / SoC platform'],
      },
    ],
  },
  {
    name: 'cloud',
    path: '/resources/use-cases/',
    title: 'Cloud & Infrastructure | Xen Project',
    heading: 'Open virtualization for cloud and infrastructure platforms.',
    keyHeading: 'Capabilities for owning the platform boundary',
    finalCta: '#final-cta',
    heroActions: [
      {label: 'Explore the hypervisor', href: '/projects/hypervisor/'},
      {label: 'Explore XCP-ng', href: '/projects/xcp-ng/'},
    ],
    finalActions: [
      {label: 'Explore architecture', href: '/technology/architecture/'},
      {label: 'Explore XCP-ng', href: '/projects/xcp-ng/'},
      {label: 'Start contributing', href: '/contribute/get-started/'},
      {label: 'Become a member', href: '/about/become-a-member/'},
    ],
    diagrams: [
      {
        title: 'Infrastructure layers',
        variant: 'hero',
        layers: ['Cloud workloads', 'Virtual machines', 'Xen hypervisor', 'Hardware'],
      },
      {
        title: 'Xen-centered ecosystem',
        variant: 'standard',
        layers: ['Platforms and services', 'XAPI management toolstack', 'Xen hypervisor', 'Hardware'],
      },
    ],
  },
  {
    name: 'safety',
    path: '/technology/safety/',
    title: 'Safety-Critical Systems | Xen Project',
    heading: 'Open virtualization for safety-conscious systems.',
    keyHeading: 'Capabilities engineers evaluate when building safety-conscious platforms.',
    finalCta: '#final-cta',
    heroActions: [
      {label: 'Explore safety resources', href: '#resources'},
      {label: 'Become a member', href: '/about/become-a-member/'},
    ],
    finalActions: [
      {label: 'Explore safety resources', href: '#resources'},
      {label: 'Become a member', href: '/about/become-a-member/'},
      {label: 'Start contributing', href: '/contribute/get-started/'},
    ],
    diagrams: [
      {
        title: 'Inspectable boundaries',
        variant: 'hero',
        layers: ['Safety-critical workloads', 'Non-critical services', 'Guest domains', 'Xen hypervisor boundary', 'Hardware / SoC platform'],
      },
    ],
  },
];

type RuntimeMonitor = {
  assertHealthy: () => Promise<void>;
};

const isSameOrigin = (url: string, baseUrl: string) => {
  try {
    return new URL(url).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
};

export const monitorPageRuntime = (page: Page, baseUrl: string): RuntimeMonitor => {
  const errors: string[] = [];

  page.on('console', message => {
    const text = message.text();
    if (message.type() === 'error' || /(?:failed to hydrate|hydration (?:error|failed|mismatch))/i.test(text)) {
      errors.push(`console: ${text}`);
    }
  });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', request => {
    if (isSameOrigin(request.url(), baseUrl)) {
      errors.push(`requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`);
    }
  });
  page.on('response', response => {
    if (response.status() >= 400 && isSameOrigin(response.url(), baseUrl)) {
      errors.push(`response: ${response.status()} ${response.url()}`);
    }
  });

  return {
    async assertHealthy() {
      await page.waitForTimeout(50);
      expect(errors, 'The page must not emit same-origin runtime or network errors').toEqual([]);
    },
  };
};

export async function createProfilePage(browser: Browser, baseUrl: string, options: BrowserContextOptions) {
  const context = await browser.newContext({...options, baseURL: baseUrl});
  const page = await context.newPage();
  const runtime = monitorPageRuntime(page, baseUrl);
  return {context, page, runtime};
}

export async function settlePage(page: Page) {
  await page.evaluate(async () => {
    const delay = (milliseconds: number) =>
      new Promise<void>(resolve => globalThis.setTimeout(resolve, milliseconds));

    await Promise.race([document.fonts.ready, delay(5_000)]);
    await Promise.race([
      Promise.all([...document.images].map(async image => {
        if (!image.complete) {
          await new Promise<void>(resolve => {
            const timeout = globalThis.setTimeout(resolve, 3_000);
            const finish = () => {
              globalThis.clearTimeout(timeout);
              resolve();
            };

            image.addEventListener('load', finish, {once: true});
            image.addEventListener('error', finish, {once: true});
          });
        }

        try {
          await image.decode();
        } catch {}
      })),
      delay(5_000),
    ]);
  });
}

const expectInsideViewport = async (locator: Locator, viewportWidth: number) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 1);
  return box!;
};

const expectActions = async (region: Locator, actions: ActionContract[], viewportWidth: number) => {
  const boxes = [];
  for (const action of actions) {
    const link = region.getByRole('link', {name: action.label, exact: true}).first();
    await expect(link).toHaveAttribute('href', action.href);
    await expect(link).toBeVisible();
    boxes.push(await expectInsideViewport(link, viewportWidth));
  }

  for (const [index, box] of boxes.entries()) {
    for (const other of boxes.slice(index + 1)) {
      const overlapWidth = Math.min(box.x + box.width, other.x + other.width) - Math.max(box.x, other.x);
      const overlapHeight = Math.min(box.y + box.height, other.y + other.height) - Math.max(box.y, other.y);
      expect(overlapWidth > 1 && overlapHeight > 1, 'CTA hit areas must not overlap').toBe(false);
    }
  }
};

const expectBelow = async (upper: Locator, lower: Locator) => {
  const upperBox = await upper.boundingBox();
  const lowerBox = await lower.boundingBox();
  expect(upperBox).not.toBeNull();
  expect(lowerBox).not.toBeNull();
  expect(lowerBox!.y).toBeGreaterThanOrEqual(upperBox!.y + upperBox!.height - 2);
};

const expectCardsInsideViewport = async (region: Locator, expectedCount: number, viewportWidth: number) => {
  const cards = region.locator('article');
  await expect(cards).toHaveCount(expectedCount);
  for (let index = 0; index < expectedCount; index += 1) {
    await expect(cards.nth(index)).toBeVisible();
    await expectInsideViewport(cards.nth(index), viewportWidth);
  }
};

async function expectPageSpecificLayout(page: Page, contract: HighValuePageContract, profile: ViewportProfile, viewportWidth: number) {
  if (contract.name === 'homepage' && profile.name === 'mobile') {
    const members = page.locator('#members');
    await members.scrollIntoViewIfNeeded();
    await expectInsideViewport(members, viewportWidth);
    expect(await members.locator('img').count()).toBeGreaterThan(0);

    const featuredCard = page.locator('#evidence-in-use article').first();
    await expect(featuredCard).toBeVisible();
    await expectInsideViewport(featuredCard, viewportWidth);
  }

  if (contract.name === 'embedded' && profile.name === 'ipad-portrait') {
    const spotlight = page.locator('.xp-agl-spotlight');
    await spotlight.scrollIntoViewIfNeeded();
    await expectInsideViewport(spotlight, viewportWidth);
    await expectInsideViewport(spotlight.getByRole('link', {name: 'Explore the AGL SDV architecture'}), viewportWidth);

    const ecosystem = page.locator('#open-platform-ecosystem');
    const diagram = ecosystem.locator('.xp-platform-diagram');
    const roleGroups = ecosystem.locator('.xp-ecosystem-role-groups');
    await expect(ecosystem.getByRole('heading', {name: 'Core platform', exact: true})).toBeVisible();
    await expect(ecosystem.getByRole('heading', {name: 'Build and domain ecosystem', exact: true})).toBeVisible();
    await expectBelow(diagram, roleGroups);
  }

  if (contract.name === 'cloud' && profile.name === 'ipad-portrait') {
    const ecosystem = page.locator('#open-infrastructure-ecosystem');
    const diagram = ecosystem.locator('.xp-platform-diagram');
    const firstRoleCard = ecosystem.locator('article').first();
    await expect(ecosystem.getByRole('heading', {name: 'XAPI', exact: true})).toBeVisible();
    await expect(ecosystem.getByRole('heading', {name: 'XCP-ng', exact: true})).toBeVisible();
    await expectInsideViewport(ecosystem.getByRole('link', {name: 'Explore XAPI', exact: true}), viewportWidth);
    await expectInsideViewport(ecosystem.getByRole('link', {name: 'Explore XCP-ng', exact: true}), viewportWidth);
    await expectBelow(diagram, firstRoleCard);
  }

  if (contract.name === 'safety' && profile.name === 'ipad-portrait') {
    await expectCardsInsideViewport(page.locator('#architecture-and-evidence'), 4, viewportWidth);
    await expectCardsInsideViewport(page.locator('#safety-committee'), 4, viewportWidth);
  }

  if (contract.name === 'safety' && profile.name === 'ipad-landscape') {
    const workloadMix = page.locator('.xp-safety-workload-mix');
    const columnCount = await workloadMix.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(columnCount, 'The dense workload mix should stack before its labels become cramped').toBe(1);
  }
}

export async function assertNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({page}).analyze();
  const violations = results.violations
    .filter(violation => violation.impact === 'serious' || violation.impact === 'critical')
    .map(violation => ({
      help: violation.help,
      id: violation.id,
      impact: violation.impact,
      targets: violation.nodes.map(node => node.target),
    }));

  expect(violations, 'The page must not have serious or critical Axe violations').toEqual([]);
}

async function expectSharedDiagrams(page: Page, contract: HighValuePageContract, viewportWidth: number) {
  const diagrams = page.locator('.xp-platform-diagram');
  await expect(diagrams).toHaveCount(contract.diagrams.length);

  for (const [index, expectedDiagram] of contract.diagrams.entries()) {
    const diagram = diagrams.nth(index);
    await expect(diagram).toHaveClass(new RegExp(`xp-platform-diagram--${expectedDiagram.variant}`));
    await expect(diagram.locator('.xp-platform-diagram__eyebrow')).toHaveText(expectedDiagram.title);
    await expect(diagram.locator('.xp-diagram-layer__title')).toHaveText(expectedDiagram.layers);
    await expect(diagram.locator('.xp-diagram-layer--emphasis-primary')).toHaveCount(1);
    await expectInsideViewport(diagram, viewportWidth);

    const semantics = await diagram.evaluate(element => {
      const labelId = element.getAttribute('aria-labelledby');
      const stack = element.querySelector<HTMLElement>('.xp-platform-stack');
      const summaryId = stack?.getAttribute('aria-describedby');
      const outerSection = element.parentElement?.closest('section');
      const diagramBox = element.getBoundingClientRect();
      const sectionBox = outerSection?.getBoundingClientRect();
      return {
        clippedSurfaceCount: [...element.querySelectorAll<HTMLElement>('.xp-diagram-layer__surface')]
          .filter(surface => surface.scrollHeight > surface.clientHeight + 1).length,
        hasLabel: Boolean(labelId && document.getElementById(labelId)?.textContent?.trim()),
        hasSummary: Boolean(summaryId && document.getElementById(summaryId)?.textContent?.trim()),
        staysInSection: Boolean(sectionBox && diagramBox.bottom <= sectionBox.bottom + 1),
      };
    });

    expect(semantics).toEqual({clippedSurfaceCount: 0, hasLabel: true, hasSummary: true, staysInSection: true});
  }
}

async function expectHomepageDiagram(page: Page, viewportWidth: number) {
  const diagram = page.locator('[data-hero-layered-platform]');
  await expectInsideViewport(diagram, viewportWidth);
  await expect(diagram.locator('[data-platform-layer]')).toHaveCount(4);
  const layerOrder = await diagram.locator('[data-platform-layer]').evaluateAll(layers => layers.map(layer => layer.getAttribute('data-platform-layer')));
  expect(layerOrder).toEqual([
    'hardware',
    'xen-hypervisor',
    'guest-systems',
    'applications',
  ]);
  await expect(diagram.locator('.hero-layered-platform__label')).toHaveCount(4);
  await expect(diagram.locator('.hero-layered-platform__label--xen-hypervisor')).toContainText('Xen hypervisor');
  await expect(page.locator('.hero-layered-platform__stack')).toHaveCSS('animation-name', 'none');
}

export async function assertHighValuePage(page: Page, contract: HighValuePageContract, profile: ViewportProfile) {
  const response = await page.goto(contract.path, {waitUntil: 'domcontentloaded'});
  expect(response, 'Navigation must return a document response').not.toBeNull();
  expect(response!.ok(), `Navigation returned HTTP ${response!.status()}`).toBe(true);
  await settlePage(page);

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  const viewportWidth = viewport!.width;
  const header = page.getByRole('banner');
  const main = page.getByRole('main');
  const footer = page.getByRole('contentinfo');
  const heading = main.getByRole('heading', {level: 1, name: contract.heading, exact: true});
  const hero = page.locator('#hero');
  const heroContent = hero.locator('[data-hero-content]');
  const heroMedia = hero.locator('[data-hero-media]');
  const finalCta = page.locator(contract.finalCta);

  await expect(header).toBeVisible();
  await expect(main).toBeVisible();
  await expect(heading).toBeVisible();
  await expect(main.getByRole('heading', {name: contract.keyHeading, exact: true})).toBeVisible();
  await expect(page.getByRole('heading', {name: /404/i})).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    new URL(contract.path, process.env.SITE_URL ?? 'https://beta.xenproject.org').toString(),
  );
  await expect(page).toHaveTitle(contract.title);

  const documentWidth = await page.evaluate(() => ({client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth}));
  expect(documentWidth.scroll).toBeLessThanOrEqual(documentWidth.client + 1);

  const headerBox = await header.boundingBox();
  const headingBox = await heading.boundingBox();
  expect(headerBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);

  await expectInsideViewport(hero, viewportWidth);
  const contentBox = await expectInsideViewport(heroContent, viewportWidth);
  const mediaBox = await expectInsideViewport(heroMedia, viewportWidth);
  const isStackedHero = profile.stackedHero || (contract.name === 'homepage' && profile.name === 'ipad-landscape');
  if (isStackedHero) {
    expect(mediaBox.y).toBeGreaterThanOrEqual(contentBox.y + contentBox.height - 2);
  } else {
    expect(contentBox.x + contentBox.width).toBeLessThanOrEqual(mediaBox.x + 2);
    expect(Math.max(contentBox.y, mediaBox.y)).toBeLessThan(Math.min(contentBox.y + contentBox.height, mediaBox.y + mediaBox.height));
  }

  await expectActions(hero, contract.heroActions, viewportWidth);
  await expect(finalCta).toBeVisible();
  await expectInsideViewport(finalCta, viewportWidth);
  await expectActions(finalCta, contract.finalActions, viewportWidth);

  if (contract.name === 'homepage') {
    await expectHomepageDiagram(page, viewportWidth);
  } else {
    await expectSharedDiagrams(page, contract, viewportWidth);
  }

  await expectPageSpecificLayout(page, contract, profile, viewportWidth);

  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  await expectInsideViewport(footer, viewportWidth);
  expect(await page.evaluate(() => globalThis.scrollY)).toBeGreaterThan(0);
}

export async function assertSafetyAnchor(page: Page) {
  await page.locator('#hero').getByRole('link', {name: 'Explore safety resources', exact: true}).click();
  await expect(page).toHaveURL(/#resources$/);
  const target = page.locator('#resources');
  await expect(target).toBeVisible();
  const targetBox = await target.boundingBox();
  const headerBox = await page.getByRole('banner').boundingBox();
  expect(targetBox).not.toBeNull();
  expect(headerBox).not.toBeNull();
  expect(targetBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
}

export async function prepareHeroScreenshot(page: Page) {
  await page.addStyleTag({content: `
    *, *::before, *::after {
      animation: none !important;
      caret-color: transparent !important;
      transition: none !important;
    }
  `});
  await page.getByRole('banner').evaluate(element => {
    element.style.position = 'static';
  });
  await settlePage(page);
  await page.evaluate(() => globalThis.scrollTo(0, 0));
  await page.waitForTimeout(50);
}

export type ProfilePage = {
  context: BrowserContext;
  page: Page;
  runtime: RuntimeMonitor;
};
