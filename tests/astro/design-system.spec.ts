import {expect, test} from '@playwright/test';
import {memberLogos} from '../../src/data/member-logos';

test.describe('Internal design system', () => {
  test('renders reusable block examples', async ({page}) => {
    await page.goto('/internal/design-system/');

    const main = page.locator('main');

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(main.getByRole('heading', {name: 'Reusable sections for high-impact pages.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'A reusable lead section for technical pages.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Credibility without carousel behavior.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Reusable cards for technical arguments.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Proof that reads as content.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'A standard next step for redesigned pages.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Compact highlights for important context.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Layered architecture is the primary visual language.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Separated layers'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Compact stack'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Pages should feel related, not templated.'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Solution-page arc'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Prominent workflows, rendered as engineering content.'})).toBeVisible();
    const commandExample = main.locator('.command-example').filter({hasText: 'Build Xen and exercise the XTF runner'});
    await expect(commandExample).toHaveCount(1);
    await expect(commandExample).toHaveAttribute('data-command-example', 'featured');
    await expect(commandExample.locator('.ec-line.mark')).toHaveCount(1);
    const featuredCopyButton = commandExample.getByRole('button', {name: 'Copy to clipboard'});
    await expect(featuredCopyButton).toHaveAttribute(
      'data-code',
      /qemu-xtf\.sh x86-64 pv64 example/,
    );
    await expect(featuredCopyButton).not.toHaveAttribute('data-code', /(^|\u007f)\$\s/u);
    const documentationExample = main.locator('.command-example').filter({hasText: 'Capture an XTF smoke-test log'});
    await expect(documentationExample).toHaveAttribute('data-command-example', 'documentation');
    await expect(documentationExample.locator('.expressive-code .title')).toHaveText('xtf-example.log');
    await expect(main.locator('#internal-layered-platform[data-illustration-scene="layered-platform"]')).toBeVisible();
    await expect(main.locator('#illustrations [data-illustration-overlay="glow"]')).toHaveAttribute('aria-hidden', 'true');
    await expect(main.locator('#internal-layered-platform [data-platform-layer="hypervisor"]')).toHaveAttribute('data-platform-layer-asset', 'image');
    await expect(main.getByRole('heading', {name: 'Safety boundary'})).toBeVisible();
    await expect(main.getByRole('heading', {name: 'Automotive stack'})).toBeVisible();
    await expect(main.getByRole('link', {name: 'Primary action'}).first()).toBeVisible();
    await expect(main.getByRole('link', {name: 'Secondary action'}).first()).toBeVisible();
    await expect(main.locator('#block-logo-cloud .uno-bg-xp-surface-light')).toHaveCount(1);
    await expect(main.locator('#block-logo-cloud img')).toHaveCount(10);
    for (const logo of memberLogos) {
      await expect(main.getByRole('link', {name: `Visit ${logo.label}`})).toHaveAttribute('href', logo.href);
      await expect(main.locator(`img[alt="${logo.label}"]`)).toHaveAttribute('src', logo.src);
    }

    await expect(main.getByRole('heading', {name: /404/i})).toHaveCount(0);
  });
});
