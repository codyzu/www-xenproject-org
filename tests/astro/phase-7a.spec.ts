import {expect, test} from '@playwright/test';
import {projects} from '../../src/data/projects.ts';
import {navigationItems} from '../../src/data/navigation.ts';

test.describe('Phase 7A cutover-readiness routes', () => {
  test('renders the complete ordered project catalog', async ({page}) => {
    await page.goto('/projects/all-projects/');
    await expect(page.getByRole('heading', {level: 1, name: 'All projects'})).toBeVisible();
    const cards = page.locator('.list-pages .card');
    await expect(cards).toHaveCount(projects.length);
    await expect(cards.locator('.card__label')).toHaveText(projects.map(project => project.title));
    for (const [index, project] of projects.entries()) {
      await expect(cards.nth(index).getByRole('link', {name: 'Discover'})).toHaveAttribute('href', project.route);
    }
  });

  test('renders cloud and infrastructure with primary evaluation actions', async ({page}) => {
    await page.goto('/resources/use-cases/');
    await expect(page.getByRole('heading', {level: 1, name: 'Open virtualization for cloud and infrastructure platforms.'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Capabilities for owning the platform boundary'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Explore the hypervisor'}).first()).toHaveAttribute('href', '/projects/hypervisor/');
    await expect(page.getByRole('link', {name: 'Explore XCP-ng'}).first()).toHaveAttribute('href', '/projects/xcp-ng/');
  });

  for (const sectionName of ['Contribute', 'Resources', 'More']) {
    test(`renders the curated ${sectionName} index from navigation`, async ({page}) => {
      const navigation = navigationItems.find(item => item.name === sectionName);
      if (!navigation) throw new Error(`${sectionName} navigation section is missing`);
      await page.goto(navigation.href);
      await expect(page.getByRole('heading', {level: 1, name: sectionName})).toBeVisible();
      const cards = page.locator('main .card');
      await expect(cards).toHaveCount(navigation.children?.length ?? 0);
      await expect(cards.locator('.card__label')).toHaveText(navigation.children?.map(child => child.name) ?? []);
    });
  }

  test('renders the deterministic page inventory without retired taxonomies', async ({page}) => {
    await page.goto('/all/');
    await expect(page.getByRole('heading', {level: 1, name: 'All pages'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Categories'})).toHaveCount(0);
    await expect(page.getByRole('link', {name: 'Tags'})).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  });

  test('renders the Astro 404 contract', async ({page}) => {
    await page.goto('/404.html');
    await expect(page.getByRole('heading', {level: 1, name: 'Page not found!'})).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.locator('body')).toHaveClass(/page-404/);
  });
});
