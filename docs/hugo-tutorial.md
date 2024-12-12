---
title: "Hugo Website Tutorial"
description: "A comprehensive guide for managing and editing the Xen Project website"
date: 2023-12-11
draft: false
---

# Hugo Website Tutorial

This tutorial will guide you through the common tasks for managing and updating the Xen Project website. We'll cover everything from basic content updates to advanced component usage.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Basic Content Management](#basic-content-management)
  - [Headers and Content](#headers-and-content)
  - [Page Structure](#page-structure)
- [Working with Images](#working-with-images)
  - [Adding Images](#adding-images)
  - [Image Sizing](#image-sizing)
- [Page Components](#page-components)
- [Site Navigation](#site-navigation)
  - [Adding New Pages](#adding-new-pages)
  - [Header/Footer Modification](#headerfooter-modification)
- [Best Practices](#best-practices)
- [Component Reference](#component-reference)

## Basic Content Management

### Headers and Content

Each page in the website starts with a YAML frontmatter section that defines its metadata:

```yaml
---
title: "Your Page Title"
description: "Page description for SEO"
keywords: "keyword1, keyword2"
date: 2024-01-14T07:07:07+01:00
draft: false
menus:
  main:
    parent: Resources
    weight: 12
---
```

### Page Structure

Pages are structured using sections and components. Here's a basic example:

```markdown
{{</* section */>}}
{{</* media-block
  title="Section Title"
  media="/path/to/media"
  alt="Alt text"
  animate="true"
*/>}}
Your content goes here
{{</* /media-block */>}}
{{</* /section */>}}
```

## Working with Images

### Adding Images

Images can be added using several methods:

1. Placement

All images should be placed in the `static/img` folder.

Be mindful of image file sizes - they should be less than 150kb. It's recommended to convert images to the `webp` format.

You can use the [Squoosh](https://squoosh.app/) tool to convert your images to webp format.

You can view most of the images used on the website in the [Images Reference](images.md) page.


2. Full-width images:
```markdown
{{</* full-width-image 
  src="/img/your-image.png" 
  alt="Image description" 
  title="Image title" 
  class="rounded-corners" 
*/>}}
```

3. Regular images in content markdown:
```markdown
![Alt text](/img/your-image.png)
```

4. Regular images in content HTML : 
```html
<img src="/img/your-image.png" alt="Image description" title="Image title" class="rounded-corners">
```

5. Full-width images in content markdown:

While less commonly used, this method is available when needed.

```markdown
{{</* full-width-image 
  src="/img/your-image.png" 
  alt="Image description" 
  title="Image title" 
  class="rounded-corners" 
*/>}}
```

### Image Sizing

Control image sizes using classes or direct HTML attributes:

```markdown
{{</* full-width-image 
  src="/img/your-image.png" 
  alt="Image description" 
  class="small-image" 
*/>}}
```

Available image classes:
- `small-image`: 300px max width
- `medium-image`: 500px max width
- `large-image`: 800px max width
- `rounded-corners`: Adds rounded corners

## Page Components

All page components are available in the [Components Guide](components.md)

## Site Navigation

### Adding New Pages

1. Create a new `.md` file in the appropriate content directory
2. Include proper frontmatter
3. Add to menu structure if needed:

```yaml
menus:
  main:
    parent: Parent Section
    weight: 10
```

### Header/Footer Modification

Header and footer content can be modified in the theme configuration:

1. Navigate to `themes/xen-project/layouts/partials/`
2. Edit `header.html` or `footer.html`

## Best Practices

1. Always include descriptive alt text for images
2. Use semantic heading structure (h1 > h2 > h3)
3. Keep URLs and file paths lowercase and hyphen-separated
4. Optimize images before uploading
5. Test pages in both desktop and mobile views

## Component Reference

Common shortcodes available:

- `section`: Create content sections
- `media-block`: Text with media combinations
- `full-width-image`: Full-width responsive images
- `md`: Markdown content within other components
- `get-downloads-links`: Resource downloads section

For detailed component documentation, see the [Components Guide](components/) 