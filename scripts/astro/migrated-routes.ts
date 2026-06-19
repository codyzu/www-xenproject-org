import {getOwnedRedirects} from '../../src/data/redirects.ts';

// Routes Astro owns in the integrated spike artifact.
export const migratedRoutes = [
  '/',
  '/about/',
  '/about/become-a-member/',
  '/about/contact-us/',
  '/about/governance/',
  '/about/project-members/',
  '/about/security-policy/',
  '/contribute/code-of-conduct/',
  '/contribute/contribution-guidelines/',
  '/contribute/get-started/',
  '/contribute/ci/',
  '/contribute/ci/status/',
  '/more/xen-branding/',
  '/projects/embedded-and-automotive/',
  '/projects/hvmi/',
  '/projects/hypervisor/',
  '/projects/hypervisor/openpgp-keys/',
  '/projects/mirage-os/',
  '/projects/unikraft/',
  '/projects/windows-pv-drivers/',
  '/projects/xapi/',
  '/projects/xcp-ng/',
  '/research/',
  '/research/barham2003xen/',
  '/research/thenot2023fastxenblk/',
  '/research/vanga2018tableau/',
  '/resources/matrix/',
  '/resources/mailing-lists/',
  '/resources/past-events/spring-meetup-2026/',
] as const satisfies readonly string[];

export const migratedRedirectRoutes = getOwnedRedirects(migratedRoutes).map((redirect) => redirect.source);

export const overlayRoutes = [...migratedRoutes, ...migratedRedirectRoutes];
