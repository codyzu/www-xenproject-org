/* eslint-disable no-await-in-loop */
import {spawn, type ChildProcess} from 'node:child_process';
import {once} from 'node:events';
import {mkdir} from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import {chromium, type Browser, type BrowserContextOptions, type Page} from '@playwright/test';

const host = '127.0.0.1';
const navigationTimeout = 30_000;
const serverStartupTimeout = 30_000;
const root = process.cwd();
const screenshotRoutes = [
  '/',
  '/projects/embedded-and-automotive/',
  '/resources/use-cases/',
  '/technology/safety/',
  '/about/become-a-member/',
  '/about/project-members/',
  '/about/governance/',
] as const satisfies readonly string[];
const extendedScreenshotRoutes = ['/internal/design-system/', '/about/'] as const satisfies readonly string[];

const profiles = [
  {
    name: 'desktop',
    options: {
      viewport: {width: 1440, height: 1200},
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    },
  },
  {
    name: 'tablet',
    options: {
      viewport: {width: 834, height: 1194},
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      hasTouch: true,
    },
  },
  {
    name: 'mobile',
    options: {
      viewport: {width: 390, height: 844},
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      isMobile: true,
      hasTouch: true,
    },
  },
] as const satisfies ReadonlyArray<{name: string; options: BrowserContextOptions}>;

type CaptureTarget = {
  name: string;
  url: string;
};

let astroProcess: ChildProcess | undefined;
let browser: Browser | undefined;
let cleanupPromise: Promise<void> | undefined;

class UsageError extends Error {}

function usage(message?: string): never {
  throw new UsageError(message);
}

function screenshotName(pathname: string): string {
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .map((segment) => segment.replaceAll(/[^\w.-]+/g, '-'))
    .filter(Boolean);

  return segments.length === 0 ? 'home.png' : `${segments.join('--')}.png`;
}

function timestamp(): string {
  return new Date()
    .toISOString()
    .replaceAll(':', '-')
    .replace(/\.\d{3}Z$/, 'Z');
}

async function availablePort(): Promise<number> {
  const server = net.createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, host, resolve);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close();
    throw new Error('Could not allocate a local port for Astro.');
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
  return address.port;
}

async function waitForServer(url: string, child: ChildProcess, output: () => string): Promise<void> {
  const deadline = Date.now() + serverStartupTimeout;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Astro exited before becoming ready.${output()}`);
    }

    try {
      await fetch(url, {signal: AbortSignal.timeout(1000)});
      return;
    } catch {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 200);
      });
    }
  }

  throw new Error(`Astro did not become ready within ${serverStartupTimeout / 1000} seconds.${output()}`);
}

async function startAstro(): Promise<string> {
  const port = await availablePort();
  const baseUrl = `http://${host}:${port}`;
  const astroCli = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
  let serverOutput = '';

  astroProcess = spawn(process.execPath, [astroCli, 'dev', '--host', host, '--port', String(port)], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const collectOutput = (chunk: string) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-4000);
  };

  astroProcess.stdout?.setEncoding('utf8');
  astroProcess.stderr?.setEncoding('utf8');
  astroProcess.stdout?.on('data', collectOutput);
  astroProcess.stderr?.on('data', collectOutput);

  await waitForServer(baseUrl, astroProcess, () => (serverOutput ? `\n\n${serverOutput.trim()}` : ''));
  console.log(`Astro ready at ${baseUrl}`);
  return baseUrl;
}

async function settlePage(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });

  await page.evaluate(async () => {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => {
        setTimeout(resolve, 10_000);
      }),
    ]);

    const scrollStep = Math.max(Math.floor(window.innerHeight * 0.8), 400);
    let steps = 0;
    for (let top = 0; top < document.documentElement.scrollHeight && steps < 200; top += scrollStep) {
      window.scrollTo(0, top);
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 75);
      });
      steps += 1;
    }

    await Promise.race([
      Promise.all(
        [...document.images].map(async (image) => {
          if (!image.complete) {
            await new Promise<void>((resolve) => {
              const finish = () => {
                clearTimeout(timeout);
                resolve();
              };

              const timeout = setTimeout(finish, 5000);
              image.addEventListener('load', finish, {once: true});
              image.addEventListener('error', finish, {once: true});
            });
          }

          if (image.complete) {
            try {
              await image.decode();
            } catch {}
          }
        }),
      ),
      new Promise<void>((resolve) => {
        setTimeout(resolve, 5000);
      }),
    ]);

    window.scrollTo(0, 0);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 250);
    });
  });
}

async function capturePage(page: Page, target: CaptureTarget, outputPath: string): Promise<void> {
  const response = await page.goto(target.url, {
    waitUntil: 'domcontentloaded',
    timeout: navigationTimeout,
  });

  if (!response) {
    throw new Error('Navigation did not return an HTTP response.');
  }

  if (!response.ok()) {
    throw new Error(`Navigation returned HTTP ${response.status()}.`);
  }

  await settlePage(page);
  await mkdir(path.dirname(outputPath), {recursive: true});
  await page.screenshot({path: outputPath, fullPage: true});
}

async function cleanup(): Promise<void> {
  cleanupPromise ??= (async () => {
    try {
      await browser?.close();
    } catch {}

    browser = undefined;

    if (astroProcess?.exitCode === null) {
      astroProcess.kill('SIGTERM');
      await Promise.race([
        once(astroProcess, 'exit'),
        new Promise<void>((resolve) => {
          setTimeout(resolve, 3000);
        }),
      ]);

      if (astroProcess.exitCode === null) {
        astroProcess.kill('SIGKILL');
      }
    }

    astroProcess = undefined;
  })();

  await cleanupPromise;
}

function installSignalHandlers(): void {
  for (const [signal, exitCode] of [
    ['SIGINT', 130],
    ['SIGTERM', 143],
  ] as const) {
    process.once(signal, () => {
      console.error(`\nReceived ${signal}; cleaning up.`);
      void (async () => {
        try {
          await cleanup();
        } finally {
          // This is a CLI and must preserve the conventional signal exit code.
          process.exit(exitCode);
        }
      })();
    });
  }
}

async function main(): Promise<void> {
  const arguments_ = process.argv.slice(2);
  const supportedFlags = new Set(['--extended', '--cookie-banner']);
  const flags = arguments_.filter((argument) => argument.startsWith('--'));
  const unknownFlag = flags.find((flag) => !supportedFlags.has(flag));
  if (unknownFlag) {
    usage(`Unknown option: ${unknownFlag}`);
  }

  const positionalArguments = arguments_.filter((argument) => !argument.startsWith('--'));
  if (positionalArguments.length > 1) {
    usage('Expected zero or one URL argument.');
  }

  const argument = positionalArguments[0];
  const captureExtendedSet = flags.includes('--extended');
  const captureCookieBanner = flags.includes('--cookie-banner');
  let baseUrl: string | undefined;
  let targets: CaptureTarget[];

  if (!argument || argument.startsWith('/')) {
    if (argument?.startsWith('//')) {
      usage('Relative routes must begin with one slash.');
    }

    baseUrl = await startAstro();
    const routes = argument
      ? [argument]
      : captureCookieBanner
        ? ['/about/become-a-member/?show-cookie-banner=1']
        : captureExtendedSet
          ? [...screenshotRoutes, ...extendedScreenshotRoutes]
          : [...screenshotRoutes];
    targets = routes.map((route) => ({
      name: captureCookieBanner
        ? screenshotName(new URL(route, baseUrl).pathname).replace(/\.png$/, '--cookie-banner.png')
        : screenshotName(new URL(route, baseUrl).pathname),
      url: new URL(route, baseUrl).toString(),
    }));
  } else {
    let url: URL;
    try {
      url = new URL(argument);
    } catch {
      usage(`Invalid URL: ${argument}`);
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
      usage(`URL must use HTTP or HTTPS: ${argument}`);
    }

    targets = [{name: screenshotName(url.pathname), url: url.toString()}];
  }

  const runDirectory = path.join(root, 'screenshots', timestamp());
  const failures: string[] = [];
  let completed = 0;

  browser = await chromium.launch();

  for (const profile of profiles) {
    const context = await browser.newContext(profile.options);
    try {
      await context.addInitScript(() => {
        try {
          localStorage.setItem('cookieConsent', 'false');
        } catch {}
      });

      for (const target of targets) {
        const page = await context.newPage();
        const outputPath = path.join(runDirectory, profile.name, target.name);

        try {
          await capturePage(page, target, outputPath);
          completed += 1;
          console.log(`Created ${path.relative(root, outputPath)}`);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`${profile.name} ${target.url}: ${message}`);
          console.error(`Failed ${profile.name} ${target.url}: ${message}`);
        } finally {
          await page.close();
        }
      }
    } finally {
      await context.close();
    }
  }

  console.log(`\nCreated ${completed} screenshot${completed === 1 ? '' : 's'} in ${path.relative(root, runDirectory)}`);
  if (failures.length > 0) {
    console.error(`${failures.length} capture${failures.length === 1 ? '' : 's'} failed.`);
    process.exitCode = 1;
  }
}

installSignalHandlers();

try {
  await main();
} catch (error) {
  if (error instanceof UsageError) {
    if (error.message) {
      console.error(error.message);
    }

    console.error(
      'Usage: npm run screenshots -- [--extended | --cookie-banner] [/route/ | https://example.com/route/]',
    );
    process.exitCode = 1;
  } else {
    throw error;
  }
} finally {
  await cleanup();
}
