# Resize an image

The size of an image depends of the integration of the image in the page.

- By markdown, the image is sized by it's size
- by html, the image is sized by the the attribute `width` and `height` or by the css style `width` and `height`
- By the component `media-block`, the image take it's the size automatically, but you can specify the size of the image

## Markdown

Example of a markdown image:

```markdown
![alt text](/img/my-image.png)
```

The image is sized by it's size.


## HTML

Example of a html image:

```markdown
  <img src="/img/my-image.png" alt="my-image" width="100" height="100">
```

The image is sized by the attribute `width` and `height`.

## Media-block

Example of a media-block:

```markdown
{{</* media-block
  title="Tutorial Video"
  media="/img/my-image.png"
  imageSize="300px"
*/>}}
Description text on the side of the image
{{</* /media-block */>}}
```

The image is sized by the property `imageSize` in the component `media-block`.

You can use the property `imageSize` with the unit `px`, `%`, `em`, `rem`, etc...


