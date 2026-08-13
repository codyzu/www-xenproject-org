# Images

Use the asset location that matches how the file is consumed.

## URL-stable public assets

Files under `public/` are copied to the build unchanged. Put assets there when
their public URL must remain stable, including downloads, externally consumed
files, logos referenced by data, and images used from Markdown or MDX.

Site imagery is organized under `public/img/`. Reference it from the URL root:

```md
![A useful description of the image](/img/flatline/data-center.svg)
```

Do not include `public` in the URL. Preserve existing paths when replacing an
asset that is already public.

## Component-owned assets

Put artwork owned by an Astro component under `src/assets/` and import it. This
lets Astro determine dimensions and optimize supported formats:

```astro
---
import {Image} from 'astro:assets';
import artwork from '../assets/illustrations/example.webp';
---

<Image src={artwork} alt="A precise description of the meaningful artwork" />
```

Use an empty `alt` value for purely decorative artwork whose meaning is already
provided by nearby text. Never use a filename as alternative text.

## Format and review

- Prefer SVG for logos, icons, connectors, and simple diagrams.
- Prefer WebP for photographic or detailed raster artwork; use PNG when
  transparency quality requires it.
- Export close to the rendered dimensions and avoid committing oversized
  source files as public assets.
- Keep labels and explanatory text in HTML rather than baking them into an
  image.
- Verify intrinsic dimensions, layout stability, mobile cropping, contrast,
  and meaningful alternative text.

Reusable layered artwork follows the separate
[illustration-system guide](illustration-system.md).
