import {expect, test} from '@playwright/test';

const solutionPages = [
  '/projects/embedded-and-automotive/',
  '/resources/use-cases/',
  '/technology/safety/',
];

test.describe('Shared platform layers diagrams', () => {
  test('uses data-derived density, deliberate four-item grids, and one Xen anchor', async ({page}) => {
    for (const path of solutionPages) {
      await page.goto(path);

      const diagrams = page.locator('.xp-platform-diagram');
      const diagramCount = await diagrams.count();
      expect(diagramCount).toBeGreaterThan(0);

      for (let index = 0; index < diagramCount; index += 1) {
        const diagram = diagrams.nth(index);
        await expect(diagram.locator('.xp-diagram-layer--emphasis-primary')).toHaveCount(1);

        const fourItemGroups = diagram.locator('.xp-domain-strip--items-4');
        const groupCount = await fourItemGroups.count();
        for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
          const group = fourItemGroups.nth(groupIndex);
          await expect(group.locator(':scope > li')).toHaveCount(4);
          const columnCount = await group.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
          expect(columnCount).toBe(2);
        }
      }
    }

    await page.goto('/technology/safety/');
    await expect(page.locator('.xp-platform-diagram--layers-5')).toHaveCount(1);
    await expect(page.locator('.xp-platform-diagram--layers-5 .xp-diagram-layer')).toHaveCount(5);

    await page.goto('/projects/embedded-and-automotive/');
    await expect(page.locator('.xp-platform-diagram--standard')).toHaveClass(/xp-platform-diagram--density-dense/);
    await page.goto('/resources/use-cases/');
    await expect(page.locator('.xp-platform-diagram--standard')).not.toHaveClass(/xp-platform-diagram--density-dense/);
  });

  test('reserves a content-protecting step for standard plates', async ({page}) => {
    for (const path of solutionPages.slice(0, 2)) {
      await page.goto(path);
      const diagram = page.locator('.xp-platform-diagram--standard');
      const geometry = await diagram.evaluate(element => {
        const layers = [...element.querySelectorAll<HTMLElement>('.xp-diagram-layer')];
        const plate = element.querySelector<HTMLElement>('.xp-diagram-layer__surface')!;
        return {
          clippedPlateCount: [...element.querySelectorAll<HTMLElement>('.xp-diagram-layer__surface')]
            .filter(surface => surface.scrollHeight > surface.clientHeight).length,
          layerStep: Math.min(...layers.slice(1).map((layer, index) =>
            layer.getBoundingClientRect().top - layers[index].getBoundingClientRect().top,
          )),
          plateHeight: plate.clientHeight,
        };
      });

      expect(geometry.clippedPlateCount).toBe(0);
      expect(geometry.layerStep / geometry.plateHeight).toBeGreaterThanOrEqual(0.8);
    }
  });

  test('keeps solution diagrams readable without horizontal overflow', async ({page}) => {
    for (const viewport of [
      {width: 1024, height: 900},
      {width: 768, height: 1024},
      {width: 390, height: 844},
    ]) {
      await page.setViewportSize(viewport);

      for (const path of solutionPages) {
        await page.goto(path);
        const layout = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          clippedPlateCount: [...document.querySelectorAll<HTMLElement>('.xp-diagram-layer__surface')]
            .filter(element => element.scrollHeight > element.clientHeight).length,
          scrollWidth: document.documentElement.scrollWidth,
        }));

        expect(layout.scrollWidth).toBe(layout.clientWidth);
        expect(layout.clippedPlateCount).toBe(0);
      }
    }
  });

  test('removes continuous diagram motion when reduced motion is preferred', async ({page}) => {
    await page.goto('/projects/embedded-and-automotive/');
    await expect(page.locator('.xp-platform-diagram--hero .xp-platform-stack__plates')).not.toHaveCSS('animation-name', 'none');
    await expect(page.locator('.xp-platform-diagram--standard .xp-platform-stack__plates')).toHaveCSS('animation-name', 'none');

    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.reload();

    const animationNames = await page.locator('.xp-platform-diagram').evaluateAll(diagrams => diagrams.flatMap(diagram => [
      getComputedStyle(diagram, '::before').animationName,
      getComputedStyle(diagram.querySelector<HTMLElement>('.xp-platform-stack__plates')!).animationName,
      getComputedStyle(diagram.querySelector<HTMLElement>('.xp-diagram-layer--emphasis-primary .xp-diagram-layer__surface')!, '::after').animationName,
    ]));

    expect(animationNames).toEqual(animationNames.map(() => 'none'));
  });

  test('omits optional meta labels without an empty placeholder', async ({page}) => {
    await page.goto('/internal/design-system/');
    const diagram = page.locator('[aria-labelledby="internal-diagram-four-layer-title"]');
    await expect(diagram).toHaveCount(1);
    await expect(diagram.locator('.xp-platform-diagram__scale')).toHaveCount(0);
  });
});
