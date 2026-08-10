import { expect, test } from "@playwright/test";

test.describe("homepage video clip", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the automotive story without eagerly loading YouTube", async ({ page }) => {
    const section = page.locator("#automotive-momentum");

    await expect(section.getByRole("heading", { name: "A major year for Xen in automotive" })).toBeVisible();
    await expect(section.getByText("Stefano Stabellini, AMD")).toBeVisible();
    await expect(section.getByText("Xen Summit 2025", { exact: true })).toBeVisible();
    await expect(section.locator("iframe")).toHaveCount(0);
    await expect(section.locator("[data-video-clip-player] img")).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/J6q67jkG5DQ/hqdefault.jpg",
    );
    await expect(
      section.getByRole("button", { name: "Play 0:57 clip: A major year for Xen in automotive" }),
    ).toBeVisible();
    await expect(section.getByRole("link", { name: "Watch the full talk" })).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=J6q67jkG5DQ",
    );
    await expect(section.locator("[data-gradient-border]")).toHaveCount(1);
    await expect(page.locator("#try-xen [data-gradient-border]")).toHaveCount(0);
  });

  test("loads the privacy-enhanced bounded embed only after keyboard activation", async ({ page }) => {
    const section = page.locator("#automotive-momentum");
    const playButton = section.getByRole("button", { name: "Play 0:57 clip: A major year for Xen in automotive" });

    await playButton.focus();
    await page.keyboard.press("Enter");

    const iframe = section.locator("iframe");
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/J6q67jkG5DQ/);
    await expect(iframe).toHaveAttribute("src", /start=17/);
    await expect(iframe).toHaveAttribute("src", /end=74/);
    await expect(iframe).toHaveAttribute("src", /autoplay=1/);
    await expect(iframe).toHaveAttribute("allow", /autoplay/);
    await expect(iframe).toHaveAttribute(
      "title",
      "Xen in Safety Systems: Hardware Domain and Control Domain separation — video clip",
    );
  });

  test("stacks without horizontal overflow at a mobile Safari-sized viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const section = page.locator("#automotive-momentum");
    const layout = await section.evaluate((element) => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      headingTop: element.querySelector("h2")?.getBoundingClientRect().top ?? 0,
      mediaTop: element.querySelector("[data-video-clip-player]")?.getBoundingClientRect().top ?? 0,
    }));

    expect(layout.overflow).toBe(0);
    expect(layout.headingTop).toBeLessThan(layout.mediaTop);
  });

  test("keeps intentional card padding and responsive composition across viewports", async ({ page }) => {
    const viewports = [
      { width: 390, height: 844, columns: 1 },
      { width: 768, height: 1024, columns: 1 },
      { width: 1024, height: 768, columns: 1 },
      { width: 1440, height: 1000, columns: 2 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();

      const metrics = await page.locator("#automotive-momentum [data-video-clip]").evaluate((element) => {
        const layout = element.querySelector<HTMLElement>("[data-video-clip-layout]");
        const copy = element.querySelector<HTMLElement>("[data-video-clip-copy]");
        const media = element.querySelector<HTMLElement>("[data-video-clip-player]");
        if (!layout || !copy || !media) throw new Error("Video clip layout is incomplete");

        const layoutStyle = getComputedStyle(layout);
        return {
          paddingLeft: Number.parseFloat(layoutStyle.paddingLeft),
          paddingTop: Number.parseFloat(layoutStyle.paddingTop),
          columnCount: layoutStyle.gridTemplateColumns.split(" ").length,
          copyLeft: copy.getBoundingClientRect().left,
          cardLeft: element.getBoundingClientRect().left,
          mediaTop: media.getBoundingClientRect().top,
          copyBottom: copy.getBoundingClientRect().bottom,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(metrics.paddingLeft).toBeGreaterThanOrEqual(16);
      expect(metrics.paddingTop).toBeGreaterThanOrEqual(16);
      expect(metrics.copyLeft - metrics.cardLeft).toBeGreaterThanOrEqual(16);
      expect(metrics.columnCount).toBe(viewport.columns);
      if (viewport.columns === 1) expect(metrics.mediaTop).toBeGreaterThan(metrics.copyBottom);
      expect(metrics.overflow).toBe(0);
    }
  });
});
