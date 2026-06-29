import {expect, test} from '@playwright/test';

const routes = [
  ['/about/governance/', 'Governance', 'Goals'],
  ['/about/project-members/', 'Xen Project members', 'AMD'],
  ['/about/security-policy/', 'Security policy', 'Scope of this process'],
  ['/projects/hvmi/', 'HVMI', 'What is HVMI?'],
  ['/projects/hypervisor/', 'Hypervisor', 'Versatile Open-Source Virtualization'],
  ['/projects/hypervisor/openpgp-keys/', 'OpenPGP Keys', 'The Hypervisor Team’s OpenPGP Keys'],
  [
    '/projects/embedded-and-automotive/',
    'Embedded & Automotive',
    'Embedded platforms need consolidation and separation at the same time.',
    'Open source virtualization for embedded and automotive systems.',
  ],
  ['/projects/mirage-os/', 'Mirage OS', 'Our architecture'],
  ['/projects/unikraft/', 'Unikraft', 'Basic concepts'],
  ['/projects/windows-pv-drivers/', 'Windows PV Drivers', 'About Windows PV Drivers'],
  ['/projects/xapi/', 'XAPI', 'What is XAPI?'],
  ['/projects/xcp-ng/', 'XCP-ng', 'Project’s history'],
  ['/resources/mailing-lists/', 'Join mailing lists', 'General'],
] as const;

test.describe('Phase 5 static routes', () => {
  for (const [path, title, heading, customH1] of routes) {
    test(`renders ${path}`, async ({page}) => {
      await page.goto(path);
      await expect(page).toHaveTitle(new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      await expect(page.getByRole('heading', {level: 1, name: customH1 ?? title})).toBeVisible();
      await expect(page.getByRole('heading', {name: heading, exact: false}).first()).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path.replaceAll('/', '\\/')}$`));
    });
  }
});
