import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {expect, test} from '@playwright/test';
import {copyParitySnapshotName, prepareCopyParitySnapshot} from './helpers/copy-parity';

test.describe('copy-parity guardrails', () => {
  test('a deliberately removed paragraph fails an ARIA snapshot assertion', async ({page}) => {
    await page.setContent('<main><p>The retained paragraph.</p></main>');

    let failure: unknown;
    try {
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - main:
          - paragraph: The retained paragraph.
          - paragraph: The deliberately removed paragraph.
      `, {timeout: 100});
    } catch (error) {
      failure = error;
    }

    expect(failure).toBeInstanceOf(Error);
    expect((failure as Error).message).toContain('toMatchAriaSnapshot');
  });

  test('removing copy from a migrated route fails its committed baseline', async ({page}) => {
    await page.goto('/about/', {waitUntil: 'domcontentloaded'});
    const main = page.getByRole('main');
    await prepareCopyParitySnapshot(main);
    await main.locator('p').first().evaluate(paragraph => paragraph.remove());

    const baseline = await readFile(path.resolve(
      'tests/astro/copy-parity.spec.ts-snapshots',
      copyParitySnapshotName('/about/'),
    ), 'utf8');
    let failure: unknown;
    try {
      await expect(main).toMatchAriaSnapshot(baseline, {timeout: 100});
    } catch (error) {
      failure = error;
    }

    expect(failure).toBeInstanceOf(Error);
    expect((failure as Error).message).toContain('toMatchAriaSnapshot');
  });

  test('link destinations and image alt text remain semantic snapshot content', async ({page}) => {
    await page.setContent('<main><a href="/expected">Read more</a><img src="test.png" alt="Meaningful alternative" /></main>');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - main:
        - link "Read more":
          - /url: /expected
        - img "Meaningful alternative"
    `);
  });

  test('unreviewed added copy fails strict ARIA matching', async ({page}) => {
    await page.setContent('<main><p>Required baseline copy.</p><p>Additional Astro copy.</p></main>');
    let failure: unknown;
    try {
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - main:
          - paragraph: Required baseline copy.
      `, {timeout: 100});
    } catch (error) {
      failure = error;
    }

    expect(failure).toBeInstanceOf(Error);
  });

  test('normalizes internal hosts and excludes only marked external copy', async ({page}) => {
    await page.setContent(`
      <main>
        <a href="https://beta.xenproject.org/about/">About</a>
        <div data-copy-parity-external="ghost">External post title</div>
        <p>Locally authored fallback.</p>
      </main>
    `);
    const main = page.getByRole('main');
    await prepareCopyParitySnapshot(main);
    await expect(main).toMatchAriaSnapshot(`
      - main:
        - link "About":
          - /url: /about
        - paragraph: Locally authored fallback.
    `);
  });
});
