import {getOwnedRedirects} from '../../src/data/redirects.ts';

// Routes Astro owns in the integrated spike artifact.
export const migratedRoutes = [
  '/',
  '/about/',
  '/about/become-a-member/',
  '/about/contact-us/',
  '/contribute/code-of-conduct/',
  '/contribute/contribution-guidelines/',
  '/contribute/get-started/',
  '/contribute/ci/',
  '/contribute/ci/status/',
  '/more/xen-branding/',
  '/research/',
  '/research/barham2003xen/',
  '/research/thenot2023fastxenblk/',
  '/research/vanga2018tableau/',
  '/resources/matrix/',
  '/resources/past-events/spring-meetup-2026/',
] as const satisfies readonly string[];

export const migratedRedirectRoutes = getOwnedRedirects(migratedRoutes).map((redirect) => redirect.source);

export const overlayRoutes = [...migratedRoutes, ...migratedRedirectRoutes];
