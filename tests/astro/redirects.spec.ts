import {expect, test} from '@playwright/test';
import {load} from 'cheerio';
import {redirects} from '../../src/data/redirects.ts';

// These expectations are intentionally hardcoded instead of importing the
// derived overlay routes. They are the independent acceptance boundary that
// catches an accidental ownership or destination change in production code.
const expectedAstroOwnedRedirects = [
  ['/more/xen-server-branding/', 'https://beta.xenproject.org/more/xen-branding/'],
  ['/resources/spring-meetup-2026/', 'https://beta.xenproject.org/resources/past-events/spring-meetup-2026/'],
  ['/resources/spring-meetup/', 'https://beta.xenproject.org/resources/past-events/spring-meetup-2026/'],
  ['/spring26/', 'https://docs.google.com/document/d/1ddsfCTaDHvBOCtFLMTgoGEzaQSdJdogfIGooHWFnLJQ/edit?usp=sharing'],
] as const;

const expectedHugoOwnedRedirects = [
  ['/projects/', 'https://beta.xenproject.org/projects/all-projects'],
  ['/resources/xen-summit-2025/', 'https://beta.xenproject.org/resources/past-events/xen-summit-2025/'],
  ['/resources/xen-summit-2026/', 'https://beta.xenproject.org/resources/summit-2026/'],
] as const;

test.describe('Astro redirect ownership', () => {
  test('has an explicit ownership expectation for every manifest entry', () => {
    const manifestSources = redirects.map((redirect) => redirect.source).sort();
    const expectedSources = [
      ...expectedAstroOwnedRedirects.map(([source]) => source),
      ...expectedHugoOwnedRedirects.map(([source]) => source),
    ].sort();

    expect(manifestSources).toEqual(expectedSources);
  });

  for (const [source, target] of expectedAstroOwnedRedirects) {
    test(`renders the Astro redirect contract for ${source}`, async ({request}) => {
      const response = await request.get(source);
      const html = await response.text();

      expect(response.ok()).toBeTruthy();
      expect(html).toContain('data-astro-redirect');
      expect(html).toContain(`<link rel="canonical" href="${target}">`);
      expect(html).toContain(`<meta http-equiv="refresh" content="0; url=${target}">`);
      expect(html).toContain('<meta name="robots" content="noindex">');
      expect(html).toContain(`href="${target}"`);
      expect(html).toMatch(/location\s*=\s*redirectUrl/);
    });
  }

  for (const [source, target] of expectedHugoOwnedRedirects) {
    test(`keeps ${source} under Hugo ownership`, async ({request}) => {
      const response = await request.get(source);
      const html = await response.text();
      const $ = load(html);

      expect(response.ok()).toBeTruthy();
      expect(html).not.toContain('data-astro-redirect');
      expect($('link[rel="canonical"]').attr('href')).toBe(target);
      expect($('meta[http-equiv="refresh" i]').attr('content')).toBe(`0; url=${target}`);
      expect($('meta[name="robots"]').attr('content')).toBe('noindex');
    });
  }
});
