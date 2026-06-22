import {expect, test} from '@playwright/test';

test.describe('Spring Meetup 2026 past-event page', () => {
  test('renders every sponsor logo with non-zero dimensions', async ({page}) => {
    await page.goto('/resources/past-events/spring-meetup-2026/');

    const sponsors = page.getByRole('heading', {level: 2, name: 'Thank You to Our Sponsors'}).locator('..');
    const logos = sponsors.locator('img');

    await expect(logos).toHaveCount(5);
    await expect(sponsors.getByRole('heading', {level: 3, name: 'Hosting Sponsors'})).toBeVisible();
    await expect(sponsors.getByRole('heading', {level: 3, name: 'Supporting Sponsors'})).toBeVisible();

    for (const logo of await logos.all()) {
      await expect(logo).toBeVisible();
      const box = await logo.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    }

    await expect(sponsors).toHaveScreenshot('spring-meetup-2026-sponsors.png');
  });
});
