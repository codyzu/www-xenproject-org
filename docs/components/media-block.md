# media-block

[![Media block with left media position](../images/media-block--left-thumb.png)](../images/media-block--left.png) [![Media block with right media position](../images/media-block--right-thumb.png)](../images/media-block--right.png)


The `media-block` is a flexible component for displaying content with a media element (image, video, or other component).
```markdown
{{<media-block
  title="**Discover** our *new* technology"
  media="/images/tech-demo.jpg"
  mediaPosition="right"
  mediaMobilePosition="top"
  imageAlt="Demonstration of our new technology"
  imageSize="600"
  label="NEW"
  titleLevel="2"
  titleClass="text-primary"
  class="bg-light border-rounded"
  animate="true"
>}}
  ## A remarkable innovation

  Our revolutionary new technology improves productivity by **50%**.
  Discover its main features:

  * Optimized performance
  * Intuitive interface
  * Maximum compatibility

  <div class="mt-4">
    <a href="/demo" class="btn btn-primary">
      Request a demo <i class="fas fa-arrow-right"></i>
    </a>
  </div>
{{</media-block>}}
```

| Parameter             | Type   | Default       | Description                                                                                                                                                                     |
| --------------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`               | string | -             | Block title. Supports markdown for bold (`**text**`) and italic (`*text*`)                                                                                                      |
| `media`               | string | -             | URL of image/video or shortcode of another component. Supports: images (png, jpg, jpeg, avif, webp, gif, svg), videos (mp4), YouTube, SlideShare and partial or HTML components |
| `mediaPosition`       | string | "left"        | Position of media element: `"left"` or `"right"`                                                                                                                                |
| `mobileMediaPosition` | string | "left"        | Position of media element on mobile: `"top"` or `"bottom"`                                                                                                                      |
| `imageAlt`            | string | "Media image" | Alternative text for image                                                                                                                                                      |
| `imageSize`           | string | -             | Image size (width in pixels)                                                                                                                                                    |
| `label`               | string | -             | Optional label above title                                                                                                                                                      |
| `titleLevel`          | string | "2"           | HTML title level (h1-h6)                                                                                                                                                        |
| `titleClass`          | string | -             | Additional CSS classes for title                                                                                                                                                |
| `class`               | string | -             | Additional CSS classes for block                                                                                                                                                |
| `animate`             | string | "false"       | Activates block animation: `"true"` or `"false"`                                                                                                                                |

The content between the shortcode tags can include Markdown and HTML.