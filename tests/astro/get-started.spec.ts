import {expect, test} from '@playwright/test';

test.describe('Get started page', () => {
  test('renders the introductory YouTube video at the full media-column width and 16:9', async ({page}) => {
    await page.route('https://www.youtube.com/**', (route) => route.abort());
    await page.goto('/contribute/get-started/');

    const media = page.locator('.media-block__media').first();
    const container = media.locator('.youtube-video-container');
    const player = container.locator('.video-container');
    const iframe = player.locator('iframe');

    await expect(container).toBeVisible();
    await expect(iframe).toBeVisible();

    const [mediaBox, containerBox, iframeBox] = await Promise.all([
      media.boundingBox(),
      container.boundingBox(),
      iframe.boundingBox(),
    ]);

    expect(mediaBox).not.toBeNull();
    expect(containerBox).not.toBeNull();
    expect(iframeBox).not.toBeNull();
    expect(containerBox!.width).toBeCloseTo(mediaBox!.width, 0);
    expect(iframeBox!.width).toBeGreaterThan(500);
    expect(iframeBox!.width / iframeBox!.height).toBeCloseTo(16 / 9, 2);

    await expect(media).toHaveScreenshot('get-started-intro-video.png');
  });
});
