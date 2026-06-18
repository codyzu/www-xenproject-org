import {expect, type Page, test} from '@playwright/test';

const gitlabGraphQlResponse = {
  data: {
    project: {
      pipelines: {
        nodes: [
          {
            id: 'gid://gitlab/Ci::Pipeline/123456',
            iid: '123456',
            source: 'push',
            duration: 372,
            status: 'SUCCESS',
            createdAt: '2026-01-15T12:34:00Z',
            detailedStatus: {
              label: 'passed',
            },
            stages: {
              nodes: [
                {
                  name: 'test',
                  groups: {
                    nodes: [
                      {
                        name: 'hardware',
                        jobs: {
                          nodes: [
                            {
                              id: 'gid://gitlab/Ci::Build/111',
                              name: 'adl-gcc-debug-64',
                              status: 'SUCCESS',
                              stage: {name: 'test'},
                              detailedStatus: {
                                label: 'passed',
                                favicon: '',
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: 'qemu',
                        jobs: {
                          nodes: [
                            {
                              id: 'gid://gitlab/Ci::Build/222',
                              name: 'qemu-smoke-x86-64',
                              status: 'SUCCESS',
                              stage: {name: 'test'},
                              detailedStatus: {
                                label: 'passed',
                                favicon: '',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
};

async function mockGitlabGraphQl(page: Page) {
  await page.route('https://gitlab.com/api/graphql', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: gitlabGraphQlResponse,
    });
  });
}

test.describe('React island migration guardrails', () => {
  test('hydrates the Astro-owned CI status dashboard island', async ({page}) => {
    await mockGitlabGraphQl(page);
    await page.goto('/contribute/ci/status/');

    const island = page.locator('#ci-status');
    await expect(island).toBeVisible();
    await expect(island.getByRole('heading', {name: 'Last pipeline'})).toBeVisible();
    await expect(island.getByText('Last pipeline run:')).toBeVisible();
    await expect(island.getByRole('link', {name: '#123456', exact: true})).toHaveAttribute(
      'href',
      /gitlab\.com\/xen-project\/hardware\/xen\/-\/pipelines\/123456/,
    );
    await expect(island.getByRole('heading', {name: 'Test filters'})).toBeVisible();
    await expect(island.getByRole('heading', {name: 'Global test status'})).toBeVisible();
    await expect(island.getByRole('heading', {name: 'Job heatmap'})).toBeVisible();
  });

  test('hydrates the Astro-owned CI hardware grid island', async ({page}) => {
    await mockGitlabGraphQl(page);
    await page.goto('/contribute/ci/');

    const island = page.locator('#hardware-grid');
    await island.scrollIntoViewIfNeeded();
    await expect(island).toBeVisible();
    await expect(island.getByText('Test pipeline triggered at:')).toBeVisible();
    await expect(island.getByText('Intel Alder Lake (i5-12600K)')).toBeVisible();
    await expect(island.getByRole('button', {name: 'Next'})).toBeVisible();
    await expect(island.getByRole('button', {name: 'Prev'})).toBeVisible();
    await expect(island.getByRole('link', {name: 'View Pipeline on GitLab'})).toHaveAttribute(
      'href',
      /gitlab\.com\/xen-project\/hardware\/xen\/-\/pipelines\/123456/,
    );
  });

  test('hydrates the Astro-owned About logo wheel island', async ({page}) => {
    await page.goto('/about/');

    const island = page.locator('#logo-wheel').first();
    await island.scrollIntoViewIfNeeded();
    await expect(island).toBeVisible();
    await expect(island.locator('img')).not.toHaveCount(0);
    await expect(island.locator('img').first()).toHaveAttribute('alt', /\S/);
    await expect(island.locator('img').first()).toHaveAttribute('src', /\S/);
  });

  test('hydrates the Astro-owned Get started logo wheel island', async ({page}) => {
    await page.goto('/contribute/get-started/');

    const island = page.locator('#logo-wheel');
    await island.scrollIntoViewIfNeeded();
    await expect(island.locator('img')).not.toHaveCount(0);
    await expect(island.locator('img').first()).toHaveAttribute('src', /\S/);
  });

  test('hydrates the Astro-owned homepage islands', async ({page}) => {
    await page.goto('/');

    const story = page.locator('#xen-story');
    await expect(story).toBeVisible();
    await expect(story.getByText('Scroll down to meet your guide...')).toBeVisible();

    const logoWheel = page.locator('#logo-wheel');
    await logoWheel.scrollIntoViewIfNeeded();
    await expect(logoWheel.locator('img')).not.toHaveCount(0);
  });

  test('renders Astro-owned research links without legacy React mounts', async ({page}) => {
    await page.goto('/research/');

    const researchLink = page.getByRole('link', {name: 'Read the Full Paper'}).first();
    await expect(researchLink).toBeVisible();
    await expect(researchLink).toHaveAttribute('href', /^https?:\/\//);
    await expect(page.locator('div[data-component="IconButton"]')).toHaveCount(0);

    const search = page.getByRole('searchbox', {name: 'Search Papers:'});
    await search.fill('no matching paper');
    await expect(page.getByText('No papers found matching your search.')).toBeVisible();
    await search.clear();
    await expect(researchLink).toBeVisible();
  });

  for (const paperId of ['barham2003xen', 'thenot2023fastxenblk', 'vanga2018tableau']) {
    test(`renders Astro-owned ${paperId} link without a legacy React mount`, async ({page}) => {
      await page.goto(`/research/${paperId}/`);

      const paperLink = page.getByRole('link', {name: 'Read the Full Paper'});
      await expect(paperLink).toBeVisible();
      await expect(paperLink).toHaveAttribute('href', /^https?:\/\//);
      await expect(page.locator('div[data-component="IconButton"]')).toHaveCount(0);
    });
  }

  test('renders Astro-owned meetup actions without legacy React mounts', async ({page}) => {
    await page.goto('/resources/past-events/spring-meetup-2026/');

    await expect(page.getByRole('link', {name: 'Register now'}).first()).toHaveAttribute('href', /^https?:\/\//);
    await expect(page.getByRole('link', {name: 'View schedule'})).toHaveAttribute('href', /^https?:\/\//);
    await expect(page.locator('div[data-component="IconButton"]')).toHaveCount(0);
  });

  test('hydrates the Astro-owned membership islands', async ({page}) => {
    await page.addInitScript(() => {
      localStorage.removeItem('cookieConsent');
    });

    await page.goto('/about/become-a-member/');

    const logoWheel = page.locator('#logo-wheel');
    await logoWheel.scrollIntoViewIfNeeded();
    await expect(logoWheel.locator('img')).not.toHaveCount(0);

    const banner = page.getByRole('region', {name: 'Cookie consent banner'});
    await expect(banner).toBeVisible();
    await banner.getByRole('button', {name: 'Accept cookies'}).click();
    await expect(banner).toBeHidden();
    await expect(page.locator('#cookie-banner')).not.toContainText('We use a single tracking cookie');
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('cookieConsent'))).toBe('true');
  });
});
