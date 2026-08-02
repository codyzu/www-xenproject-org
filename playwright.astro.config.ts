import process from 'node:process';
import {defineConfig, devices} from '@playwright/test';

const serverPort = process.env.PLAYWRIGHT_PORT ?? '4321';
const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${serverPort}`;
const shouldStartServer = process.env.PLAYWRIGHT_START_SERVER === '1';
const shouldStartDevServer = process.env.PLAYWRIGHT_DEV_SERVER === '1';

export default defineConfig({
  testDir: './tests/astro',
  outputDir: './tests/astro-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['html', {open: 'never'}],
        ['list'],
        [
          'junit',
          {
            // Keep JUnit at the repository root so GitLab can resolve attachment paths.
            outputFile: 'junit.xml',
            includeProjectInTestName: true,
          },
        ],
      ]
    : 'list',
  use: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    baseURL: baseUrl,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  expect: {
    toMatchAriaSnapshot: {
      children: 'deep-equal',
    },
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    },
  },
  ...(shouldStartServer && {
    webServer: {
      command: shouldStartDevServer ? `npm run dev -- --port ${serverPort}` : `npm run serve -- --port ${serverPort}`,
      reuseExistingServer: false,
      timeout: 120_000,
      url: `http://127.0.0.1:${serverPort}`,
    },
  }),
  projects: [
    {
      name: 'chromium-desktop',
      testIgnore: /high-value-webkit-mobile\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 1440,
          height: 1200,
        },
      },
    },
    {
      name: 'webkit-mobile',
      testMatch: /(high-value-webkit-mobile|search)\.spec\.ts/,
      use: {
        ...devices['iPhone 13'],
        reducedMotion: 'reduce',
      },
    },
  ],
});
