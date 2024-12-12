---
title: "Section Component"
description: "Documentation for the section shortcode"
date: 2023-12-11
draft: false
---

# Section Component

The section component is used to create distinct content sections with customizable styles and layouts.

- [Usage](#usage)
- [Available Classes](#available-classes)
  - [Layout Classes](#layout-classes)
  - [Style Classes](#style-classes)
- [Examples](#examples)
  - [Centered Content Section](#centered-content-section)
  - [Feature Section](#feature-section)
- [Best Practices](#best-practices)


## Usage

Basic usage:

```markdown
{{</* section */>}}
Your content here
{{</* /section */>}}
```

With classes:

```markdown
{{</* section class="section-square-primary txt-c" */>}}
Your centered content here
{{</* /section */>}}
```

## Available Classes

### Layout Classes
- `txt-c`: Center-align text
- `txt-l`: Left-align text
- `txt-r`: Right-align text

### Style Classes
- `section-square-primary`: Primary colored background with square corners
- `section-rounded`: Rounded corners
- `section-dark`: Dark background
- `section-light`: Light background

## Examples

### Centered Content Section

```markdown
{{</* section class="section-square-primary txt-c" */>}}
{{</* md */>}}
## Join the **Community**

Connect with other developers and share your experience.
{{</* /md */>}}

<p class="mg-t-md">
  <a href="/community" class="btn btn-primary">
    Join Now <i class="fas fa-arrow-right"></i>
  </a>
</p>
{{</* /section */>}}
```

### Feature Section

```markdown
{{</* section class="section-light section-rounded" */>}}
{{</* md */>}}
## Key Features

- Fast and efficient
- Easy to use
- Highly customizable
{{</* /md */>}}
{{</* /section */>}}
```

## Best Practices

1. Use consistent styling across similar sections
2. Combine with other components like `md` for rich content
3. Keep sections focused on a single topic or purpose
4. Use appropriate spacing between sections
5. Choose colors and styles that match your site's theme 