import {expect, test} from '@playwright/test';

test.describe('retired homepage Story guardrails', () => {
  test('does not render the former Story or carousel-driven homepage patterns', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('#xen-story')).toHaveCount(0);
    await expect(page.locator('[data-story-root]')).toHaveCount(0);
    await expect(page.locator('[data-story-followup]')).toHaveCount(0);
    await expect(page.locator('[data-project-carousel]')).toHaveCount(0);
    await expect(page.locator('[data-latest-news]')).toHaveCount(0);
    await expect(page.locator('#logo-wheel')).toHaveCount(0);
  });
});
