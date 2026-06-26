import {getOwnedRedirects} from '../../src/data/redirects.ts';

// Routes Astro owns in the integrated spike artifact.
export const migratedRoutes = [
  '/',
  '/all/',
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
  '/contribute/',
  '/more/',
  '/more/xen-branding/',
  '/projects/embedded-and-automotive/',
  '/projects/all-projects/',
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
  '/resources/downloads/',
  '/resources/',
  '/resources/matrix/',
  '/resources/mailing-lists/',
  '/resources/past-events/',
  '/resources/past-events/spring-meetup-2026/',
  '/resources/past-events/xen-summit-2025/',
  '/resources/summit-2026/',
  '/resources/use-cases/',
] as const satisfies readonly string[];

export const redesignRoutes = [
  '/community/',
  '/technology/',
  '/technology/architecture/',
  '/technology/isolation-and-security/',
  '/technology/safety/',
] as const satisfies readonly string[];

export const migratedRedirectRoutes = getOwnedRedirects(migratedRoutes).map((redirect) => redirect.source);
export const standaloneContentRoutes = [...migratedRoutes, ...redesignRoutes] as const satisfies readonly string[];
