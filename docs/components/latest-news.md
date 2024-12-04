---
title: "Latest News"
description: "A component for displaying the latest blog posts in a carousel"
---

# Latest News Component

[![Latest news component](../images/latest-news-thumb.png)](../images/latest-news.png)

The Latest News component displays the most recent blog posts in a carousel format with navigation buttons. It automatically fetches and displays up to 10 latest posts from the blog section.

## Basic Usage

To add the Latest News component to your page, use the following shortcode:

```markdown
{{<section container="full">}}
{{<latest-news>}}
{{</section>}}
```

## Features

- Displays up to 10 latest blog posts
- Responsive carousel design
- Navigation buttons (previous/next)
- Automatic content generation from blog posts
- "Read all news" link to the blog section
- Displays post metadata:
  - Title
  - Publication date
  - Tags (if available)
  - Excerpt
  - Author(s) (if available)
