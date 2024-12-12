---
title: "Media Block Component"
description: "Documentation for the media-block shortcode"
date: 2023-12-11
draft: false
---

# Media Block Component

The media block component is used to create sections that combine media (images or videos) with text content. It's highly flexible and can be used for various layouts.


[![Media block with left media position](../images/media-block--left-thumb.png)](../images/media-block--left.png) [![Media block with right media position](../images/media-block--right-thumb.png)](../images/media-block--right.png)

- [Usage](#usage)
- [Parameters](#parameters)
- [Examples](#examples)
  - [Image with Right-aligned Media](#image-with-right-aligned-media)
  - [Video Integration](#video-integration)
- [Best Practices](#best-practices)



## Usage

Basic usage:

```markdown
{{</* media-block
  title="Your Title"
  media="/path/to/media"
  alt="Media description"
  animate="true"
*/>}}
Your content goes here
{{</* /media-block */>}}
```

## Parameters

| Parameter     | Description                           | Required | Default |
| ------------- | ------------------------------------- | -------- | ------- |
| title         | Block title                           | No       | ""      |
| media         | URL to media (image or video)         | Yes      | -       |
| alt           | Alt text for media                    | Yes      | -       |
| mediaPosition | Position of media ("left" or "right") | No       | "left"  |
| animate       | Enable animation                      | No       | false   |
| titleLevel    | Heading level (1-6)                   | No       | 2       |
| titleClass    | Additional CSS classes for title      | No       | ""      |
| class         | Additional CSS classes for block      | No       | ""      |

## Examples

### Image with Right-aligned Media

```markdown
{{</* media-block
  title="Feature Overview"
  media="/img/feature.png"
  alt="Feature illustration"
  mediaPosition="right"
  animate="true"
*/>}}
This feature provides powerful capabilities for...
{{</* /media-block */>}}
```

### Video Integration

```markdown
{{</* media-block
  title="Tutorial Video"
  media="https://www.youtube.com/embed/VIDEO_ID"
  alt="Tutorial video"
  mediaPosition="left"
*/>}}
Watch this tutorial to learn how to...
{{</* /media-block */>}}
```

## Best Practices

1. Always provide descriptive alt text
2. Use animation sparingly
3. Keep content concise and focused
4. Test different media positions for optimal layout
5. Ensure media files are optimized for web use