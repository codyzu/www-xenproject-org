import {expect, type Locator} from '@playwright/test';

const externalRegionSelector = '[data-copy-parity-external]';
const interactiveChromeSelector = '#cookie-banner';

export async function prepareCopyParitySnapshot(main: Locator) {
  await expect(main).toHaveCount(1);

  const invalidRegions = await main.locator(externalRegionSelector).evaluateAll(regions => regions
    .filter(region => ['MAIN', 'ARTICLE', 'SECTION'].includes(region.tagName))
    .map(region => ({
      marker: region.getAttribute('data-copy-parity-external'),
      tag: region.tagName.toLowerCase(),
    })));

  expect(invalidRegions, 'External copy-parity markers must target only the dynamic result container').toEqual([]);

  await main.locator(`${externalRegionSelector}, ${interactiveChromeSelector}`).evaluateAll(regions => {
    for (const region of regions) region.setAttribute('aria-hidden', 'true');
  });

  await main.evaluate((root) => {
    for (const anchor of root.querySelectorAll<HTMLAnchorElement>('a[href]')) {
      let url: URL;
      try {
        url = new URL(anchor.getAttribute('href')!, 'https://copy-parity.invalid/');
      } catch {
        continue;
      }
      const isInternal = ['copy-parity.invalid', 'beta.xenproject.org', '127.0.0.1', 'localhost'].includes(url.hostname);
      if (!isInternal) continue;

      const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
      anchor.setAttribute('href', `${pathname}${url.search}${url.hash}`);
    }
  });
}

export function copyParitySnapshotName(route: string) {
  return route === '/' ? 'copy-parity-home.aria.yml' : `copy-parity-${route.slice(1, -1).replaceAll('/', '--')}.aria.yml`;
}
