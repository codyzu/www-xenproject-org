---
title: "Full Width Image Component"
description: "Documentation for the full-width-image shortcode"
date: 2023-12-11
draft: false
---

# Full Width Image Component

The full-width-image component is used to display images that span the full width of their container, with various styling options.

## Usage

Basic usage:

```markdown
{{</* full-width-image 
  src="/img/your-image.png" 
  alt="Image description" 
  title="Image title" 
*/>}}
```

## Parameters

| Parameter | Description             | Required | Default            |
| --------- | ----------------------- | -------- | ------------------ |
| src       | Image source URL        | Yes      | -                  |
| alt       | Alternative text        | Yes      | "Full width image" |
| title     | Image title             | No       | -                  |
| class     | Additional CSS classes  | No       | -                  |
| imgClass  | Classes for img element | No       | -                  |

## Examples

### Basic Full Width Image

```markdown
{{</* full-width-image 
  src="/img/banner.jpg" 
  alt="Welcome banner" 
  title="Welcome to our site" 
*/>}}
```

### Rounded Corners Image

```markdown
{{</* full-width-image 
  src="/img/feature.jpg" 
  alt="Feature overview" 
  class="rounded-corners" 
*/>}}
```

### Image with Custom Classes

```markdown
{{</* full-width-image 
  src="/img/hero.jpg" 
  alt="Hero image" 
  class="shadow-lg" 
  imgClass="opacity-90" 
*/>}}
```

## Available Classes

### Container Classes
- `rounded-corners`: Adds rounded corners to the image container
- `shadow-sm`: Adds small shadow
- `shadow-lg`: Adds large shadow
- `mg-t-sm`: Adds small top margin
- `mg-b-sm`: Adds small bottom margin

### Image Classes
- `opacity-90`: Sets image opacity to 90%
- `grayscale`: Converts image to grayscale
- `blur-sm`: Adds slight blur effect

## Best Practices

1. Always provide descriptive alt text for accessibility
2. Optimize images before uploading (compress, proper dimensions)
3. Use appropriate image formats (JPEG for photos, PNG for graphics)
4. Consider loading time when using large images
5. Test how images appear on different screen sizes 