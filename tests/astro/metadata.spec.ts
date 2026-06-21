import {expect, test} from '@playwright/test';
import {mockGhostApi} from './fixtures/ghost-posts';

const siteDescription = 'The Xen Project develops enterprise-grade open source virtualization solutions trusted by millions of users. Secure, flexible, and powerful hypervisor technology.';
const fallbackSocialImage = 'https://beta.xenproject.org/img/logo-xen.svg';
const researchSummary = 'This foundational paper introduces Xen, detailing its architecture and performance benefits compared to other virtualization techniques.';

test.describe('Astro metadata parity', () => {
  test.beforeEach(async ({page}) => mockGhostApi(page));

  test('renders the homepage metadata contract', async ({page}) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Xen Project - Open Source Virtualization');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', siteDescription);
    await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content', /Xen Project,  open source virtualization/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://beta.xenproject.org/');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://beta.xenproject.org/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', fallbackSocialImage);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', fallbackSocialImage);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  });

  test('renders content metadata with summary fallback', async ({page}) => {
    await page.goto('/research/barham2003xen/');

    await expect(page).toHaveTitle('Xen and the Art of Virtualization | Xen Project');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', researchSummary);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', researchSummary);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', researchSummary);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://beta.xenproject.org/research/barham2003xen/');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://beta.xenproject.org/research/barham2003xen/');
  });
});
