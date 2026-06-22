import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {expect, test} from '@playwright/test';
import yaml from 'js-yaml';
import {migratedRoutes} from '../../scripts/astro/migrated-routes';
import {copyParitySnapshotName, prepareCopyParitySnapshot} from './helpers/copy-parity';

test.describe('approved copy baseline', {tag: '@copy-parity'}, () => {
  test.beforeAll(async ({}, testInfo) => {
    const snapshotDirectory = path.resolve('tests/astro/copy-parity.spec.ts-snapshots');
    const actualSnapshots = new Set((await readdir(snapshotDirectory).catch(() => [])).filter(file => file.endsWith('.aria.yml')));
    const expectedSnapshots = new Set(migratedRoutes.map(copyParitySnapshotName));
    const orphanedSnapshots = [...actualSnapshots].filter(file => !expectedSnapshots.has(file));
    expect(orphanedSnapshots, 'Copy-parity snapshots must map to a migrated route').toEqual([]);
    if (testInfo.config.updateSnapshots !== 'all') {
      expect(actualSnapshots, 'Every migrated route must have one committed ARIA snapshot').toEqual(expectedSnapshots);
    }

    const manifest = yaml.load(await readFile('data/copy-parity-exceptions.yaml', 'utf8')) as {
      version?: number;
      exceptions?: Array<{id?: string; route?: string; kind?: string; scope?: string; reason?: string}>;
    };
    expect(manifest.version, 'Copy-parity exception manifest version').toBe(1);
    expect(Array.isArray(manifest.exceptions), 'Copy-parity exceptions must be an array').toBe(true);

    const ids = new Set<string>();
    for (const exception of manifest.exceptions ?? []) {
      expect(exception.id, 'Every copy-parity exception requires an ID').toBeTruthy();
      expect(ids.has(exception.id!), `Duplicate copy-parity exception ID: ${exception.id}`).toBe(false);
      ids.add(exception.id!);
      expect(exception.route, `Exception ${exception.id} requires a route`).toBeTruthy();
      expect(exception.route, `Exception ${exception.id} cannot use a wildcard route`).not.toContain('*');
      expect(migratedRoutes, `Exception ${exception.id} must reference a migrated route`).toContain(exception.route);
      expect(exception.kind, `Exception ${exception.id} requires a kind`).toBeTruthy();
      expect(exception.scope, `Exception ${exception.id} requires a narrow scope`).toBeTruthy();
      expect(exception.reason, `Exception ${exception.id} requires a reason`).toBeTruthy();
    }
  });

  for (const route of migratedRoutes) {
    test(`${route} retains its approved main content`, async ({page}, testInfo) => {
      await page.route('**/ghost/api/content/posts/**', async request => request.abort());
      await page.goto(route, {waitUntil: 'domcontentloaded'});

      const main = page.getByRole('main');
      await prepareCopyParitySnapshot(main);
      if (testInfo.config.updateSnapshots === 'all') {
        const snapshotDirectory = path.resolve('tests/astro/copy-parity.spec.ts-snapshots');
        await mkdir(snapshotDirectory, {recursive: true});
        await writeFile(path.join(snapshotDirectory, copyParitySnapshotName(route)), await main.ariaSnapshot());
        return;
      }

      await expect(main).toMatchAriaSnapshot({name: copyParitySnapshotName(route), timeout: 500});
    });
  }
});
