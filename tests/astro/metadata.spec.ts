import {expect, test} from '@playwright/test';
import {mockGhostApi} from './fixtures/ghost-posts';

const siteDescription = 'The Xen Project develops an open source hypervisor for infrastructure, embedded, security-sensitive, and virtualization platforms that need clear separation and long-term control.';
const siteUrl = new URL(process.env.SITE_URL ?? 'https://beta.xenproject.org');
const fallbackSocialImage = new URL('/img/logo-xen.svg', siteUrl).toString();
const researchSummary = 'This foundational paper introduces Xen, detailing its architecture and performance benefits compared to other virtualization techniques.';

test.describe('Astro metadata parity', () => {
  test.beforeEach(async ({page}) => mockGhostApi(page));

  test('renders the homepage metadata contract', async ({page}) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Xen Project - Open Source Virtualization');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', siteDescription);
    await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content', /Xen Project,  open source virtualization/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new URL('/', siteUrl).toString());
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', new URL('/', siteUrl).toString());
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
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new URL('/research/barham2003xen/', siteUrl).toString());
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', new URL('/research/barham2003xen/', siteUrl).toString());
  });
});
