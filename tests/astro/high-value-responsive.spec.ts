import process from 'node:process';
import {expect, test} from '@playwright/test';
import {
  assertHighValuePage,
  assertSafetyAnchor,
  chromiumProfiles,
  createProfilePage,
  highValuePages,
  prepareHeroScreenshot,
} from './helpers/high-value';

const screenshotNames = new Map([
  ['homepage:desktop', 'homepage-hero-desktop.png'],
  ['homepage:mobile', 'homepage-hero-mobile.png'],
  ['embedded:ipad-landscape', 'embedded-hero-ipad-landscape.png'],
  ['cloud:ipad-portrait', 'cloud-hero-ipad-portrait.png'],
  ['safety:mobile', 'safety-hero-mobile.png'],
]);

test.describe('High-value responsive pages', {tag: '@high-value'}, () => {
  for (const profile of chromiumProfiles) {
    for (const pageContract of highValuePages) {
      test(`${pageContract.name} at ${profile.name}`, async ({browser}, testInfo) => {
        const baseUrl = String(testInfo.project.use.baseURL);
        const {context, page, runtime} = await createProfilePage(browser, baseUrl, profile.options);

        try {
          await assertHighValuePage(page, pageContract, profile);
          if (pageContract.name === 'safety') {
            await assertSafetyAnchor(page);
          }

          await runtime.assertHealthy();

          const screenshotName = screenshotNames.get(`${pageContract.name}:${profile.name}`);
          if (screenshotName && process.platform === 'linux') {
            testInfo.snapshotSuffix = '';
            await prepareHeroScreenshot(page);
            await expect(page.locator('#hero')).toHaveScreenshot(screenshotName, {
              animations: 'disabled',
              caret: 'hide',
              maxDiffPixelRatio: 0.005,
            });
          }
        } finally {
          await context.close();
        }
      });
    }
  }
});
