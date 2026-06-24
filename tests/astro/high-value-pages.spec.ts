import {expect, test} from '@playwright/test';
import {mockGhostApi} from './fixtures/ghost-posts';

const highValuePages = [
  {
    name: 'home',
    path: '/',
    title: /Xen Project/i,
    heading: /Open source virtualization for systems that demand isolation and control/i,
    screenshot: 'home-page.png',
    fullPage: false,
  },
  {
    name: 'about',
    path: '/about/',
    title: /About Xen Project/i,
    heading: /About Xen Project/i,
    screenshot: 'about-page.png',
  },
  {
    name: 'become a member',
    path: '/about/become-a-member/',
    title: /Become a member/i,
    heading: /Become a member/i,
    screenshot: 'become-a-member-page.png',
  },
  {
    name: 'all projects',
    path: '/projects/all-projects/',
    title: /All projects/i,
    heading: /All projects/i,
    screenshot: 'all-projects-page.png',
  },
  {
    name: 'hypervisor',
    path: '/projects/hypervisor/',
    title: /Hypervisor/i,
    heading: /Hypervisor/i,
    screenshot: 'hypervisor-page.png',
  },
  {
    name: 'downloads',
    path: '/resources/downloads/',
    title: /Downloads/i,
    heading: /Downloads/i,
    screenshot: 'downloads-page.png',
  },
  {
    name: 'use cases',
    path: '/resources/use-cases/',
    title: /Use cases/i,
    heading: /Use cases/i,
    screenshot: 'use-cases-page.png',
  },
  {
    name: 'summit 2026',
    path: '/resources/summit-2026/',
    title: /Xen Summit 2026/i,
    heading: /Xen Summit 2026/i,
    screenshot: 'summit-2026-page.png',
  },
  {
    name: 'past events',
    path: '/resources/past-events/',
    title: /Past Events/i,
    heading: /Past Events Archive/i,
    screenshot: 'past-events-page.png',
  },
  {
    name: 'research',
    path: '/research/',
    title: /Academic Research/i,
    heading: /Academic Research/i,
    screenshot: 'research-page.png',
  },
  {
    name: 'continuous integration',
    path: '/contribute/ci/',
    title: /Continuous Integration/i,
    heading: /Continuous Integration/i,
    screenshot: 'continuous-integration-page.png',
  },
];

test.describe('Astro spike high-value page guardrails', () => {
  for (const pageContract of highValuePages) {
    test(`renders ${pageContract.name}`, async ({page}) => {
      await mockGhostApi(page);
      await page.goto(pageContract.path);

      const main = page.locator('main');

      await expect(page).toHaveTitle(pageContract.title);
      await expect(main.getByRole('heading', {name: pageContract.heading})).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      await expect(main).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.getByRole('heading', {name: /404/i})).toHaveCount(0);

      await page.evaluate(async () => document.fonts.ready);
      if (pageContract.hide) {
        await page.addStyleTag({content: `${pageContract.hide} { visibility: hidden !important; }`});
      }

      await expect(page).toHaveScreenshot(pageContract.screenshot, {
        fullPage: pageContract.fullPage ?? true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
