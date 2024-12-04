---
title: "Carousel"
description: "A carousel component for displaying a rotating list of items"
---

# Carousel Component

[![Carousel component](../images/carousel-thumb.png)](../images/carousel.png)

The carousel component allows you to display a rotating list of items in a slider format with navigation buttons.

## Basic Usage

The most common use case is to display all projects using the `getpages` shortcode:

```html
{{<carousel>}}
{{<getpages "projects" "hidden">}}
{{</carousel>}}
```

## With Custom Class

You can add a custom class to the carousel container:

```html
{{<carousel class="mg-t-lg">}}
{{<getpages "projects" "hidden">}}
{{</carousel>}}
```

## Structure of Project Items

When using `getpages` with "projects", each project page should have the following front matter structure:

```yaml
---
title: "Project Name"
description: "Short description of the project"
logo: "/path/to/logo.svg"
website: "https://project-website.com"
github: "https://github.com/organization/project"
status: "active"  
---
```

## HTML Structure

The carousel component generates the following HTML structure:

```html
<div class="carousel-container">
  <div class="carousel-content">
    <div class="carousel-content-inner">
      <div class="carousel">
        <!-- Carousel items are inserted here -->
      </div>
    </div>
    <div class="carousel-buttons">
      <button class="carousel-button prev">
        <i class="fas fa-arrow-left"></i>
      </button>
      <button class="carousel-button next">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</div>
```

## Features

- Responsive design
- Navigation buttons (previous/next)
- Customizable through CSS classes
- Automatic content generation from project pages
