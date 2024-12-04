---
title: "Vertical Lists Component"
description: "Documentation for the vertical-lists component"
---

# Vertical Lists Component

[![Vertical lists component](../images/vertical-lists-thumb.png)](components/vertical-lists.md)

The `vertical-lists` component allows you to create columnar layouts with titled sections. Each section can contain text, links, or other content.

## Usage

Basic structure:
```markdown
{{<vertical-lists cols="2">}}
- title: "**Bold** Title"
  text: >
    <p>Content for the first section</p>
    
- title: "Regular Title"
  text: >
    <p>Content for the second section</p>
{{</vertical-lists>}}
```

## Parameters

- `cols`: Number of columns to display (e.g. "2" for two columns)

## List Item Properties

Each list item requires:
- `title`: The section title (supports markdown formatting)
- `text`: The content (supports HTML and markdown)

## Examples

### Example with Mixed Title Formatting

```markdown
{{<vertical-lists cols="2">}}
- title: "**Documentation** Resources"
  text: >
    <p><a href="#" class="btn btn-tertiary">Access documentation <i class="fas fa-arrow-up-right-from-square"></i></a></p>
    
- title: "Community Links"
  text: >
    <p><a href="#" class="btn btn-tertiary">Join our community <i class="fas fa-arrow-right"></i></a></p>
{{</vertical-lists>}}
```

This example shows:
- First title with partial bold formatting using `**Documentation** Resources`
- Second title with no formatting
- Both sections include buttons with icons

## Styling

The component automatically handles:
- Column layout based on the `cols` parameter
- Consistent spacing between sections
- Responsive design for different screen sizes

## Best Practices

1. Use bold formatting (`**text**`) to emphasize key words in titles
2. Keep titles concise and clear
3. Maintain consistent styling across buttons and links
4. Use icons to enhance visual hierarchy and user experience 