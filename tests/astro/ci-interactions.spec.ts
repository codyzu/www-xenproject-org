import {expect, test} from '@playwright/test';
import {
  gitlabEmptyJobsResponse,
  gitlabEmptyPipelinesResponse,
  gitlabGraphQlResponse,
  mockGitlabGraphQl,
} from './fixtures/gitlab-pipelines';

test.describe('CI interaction and state coverage', () => {
  test('navigates hardware slides with buttons and accessible dots', async ({page}) => {
    await mockGitlabGraphQl(page);
    await page.goto('/contribute/ci/');

    const island = page.locator('#hardware-grid');
    await island.scrollIntoViewIfNeeded();
    await expect(island.getByText('Intel Alder Lake (i5-12600K)')).toBeVisible();
    const firstDot = island.getByRole('button', {name: 'Go to hardware slide 1'});
    const secondDot = island.getByRole('button', {name: 'Go to hardware slide 2'});
    await expect(firstDot).toHaveAttribute('aria-current', 'true');

    await island.getByRole('button', {name: 'Next'}).click();
    await expect(secondDot).toHaveAttribute('aria-current', 'true');
    await island.getByRole('button', {name: 'Prev'}).click();
    await expect(firstDot).toHaveAttribute('aria-current', 'true');

    await island.getByRole('button', {name: 'Prev'}).click();
    await expect(firstDot).not.toHaveAttribute('aria-current', 'true');
    await firstDot.click();
    await expect(firstDot).toHaveAttribute('aria-current', 'true');
  });

  test('keeps hardware navigation usable at a mobile width', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await mockGitlabGraphQl(page);
    await page.goto('/contribute/ci/');

    const island = page.locator('#hardware-grid');
    await island.scrollIntoViewIfNeeded();
    await expect(island.getByRole('button', {name: 'Next'})).toBeVisible();
    await island.getByRole('button', {name: 'Next'}).click();
    await expect(island.getByRole('button', {name: 'Go to hardware slide 2'})).toHaveAttribute('aria-current', 'true');
  });

  test('shows hardware loading, empty, and failure states', async ({page}) => {
    let releaseResponse: (() => void) | undefined;
    const responseGate = new Promise<void>(resolve => {
      releaseResponse = resolve;
    });
    await page.route('https://gitlab.com/api/graphql', async route => {
      await responseGate;
      await route.fulfill({json: gitlabGraphQlResponse});
    });
    await page.goto('/contribute/ci/');
    await page.locator('#hardware-grid').scrollIntoViewIfNeeded();
    await expect(page.getByText('Loading Architecture').first()).toBeVisible();
    releaseResponse?.();
    await expect(page.getByText('Intel Alder Lake (i5-12600K)')).toBeVisible();

    await page.unroute('https://gitlab.com/api/graphql');
    await mockGitlabGraphQl(page, gitlabEmptyJobsResponse);
    await page.reload();
    await expect(page.getByRole('status')).toHaveText('No hardware test results were found.');

    await page.unroute('https://gitlab.com/api/graphql');
    await page.route('https://gitlab.com/api/graphql', async route => route.fulfill({status: 503, json: {}}));
    await page.reload();
    await expect(page.getByRole('alert')).toHaveText('Hardware test results are temporarily unavailable.');
  });

  test('filters hardware and QEMU jobs from status output', async ({page}) => {
    await mockGitlabGraphQl(page);
    await page.goto('/contribute/ci/status/');

    const island = page.locator('#ci-status');
    const globalStatus = island.locator('#global-test-status');
    await expect(globalStatus.getByText('adl-gcc-debug-64')).toBeVisible();
    await expect(globalStatus.getByText('qemu-smoke-x86-64')).toBeVisible();

    const hardwareToggle = island.getByRole('checkbox', {name: 'Hide Hardware Tests'});
    await hardwareToggle.focus();
    await page.keyboard.press('Space');
    await expect(globalStatus.getByText('adl-gcc-debug-64')).toHaveCount(0);
    await expect(globalStatus.getByText('qemu-smoke-x86-64')).toBeVisible();

    const qemuToggle = island.getByRole('checkbox', {name: 'Hide Qemu Tests'});
    await qemuToggle.focus();
    await page.keyboard.press('Space');
    await expect(globalStatus.getByText('qemu-smoke-x86-64')).toHaveCount(0);
    await expect(island.locator('#job-heatmap')).not.toContainText('adl-gcc-debug-64');
    await expect(island.locator('#job-heatmap')).not.toContainText('qemu-smoke-x86-64');
  });

  test('distinguishes empty and invalid CI status responses', async ({page}) => {
    await mockGitlabGraphQl(page, gitlabEmptyPipelinesResponse);
    await page.goto('/contribute/ci/status/');
    await expect(page.getByRole('status')).toHaveText('No pipelines found.');

    await page.unroute('https://gitlab.com/api/graphql');
    await mockGitlabGraphQl(page, {invalid: true});
    await page.reload();
    await expect(page.getByRole('alert')).toContainText('Something went wrong.');
  });
});
