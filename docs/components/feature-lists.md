# Features List Component

[![Features list component](../images/features-list-thumb.png)](../images/features-list.png)

The `features-list` component allows you to display a grid of features with icons, titles, and descriptions.

## Usage

To use this component in your Markdown pages, use the following shortcode syntax:

```markdown
 {{<features-list>}}
- title: Feature title
  icon: fas fa-icon-name
  description: Feature description
- title: Feature title
  icon: fas fa-icon-name
  description: Feature description
 {{</features-list>}}
```

## Parameters

### Shortcode Parameters

| Parameter | Description                   | Required | Default |
| --------- | ----------------------------- | -------- | ------- |
| cols      | Number of columns in the grid | No       | 3       |

### Item Parameters

Each list item must contain the following properties:

| Property    | Description             | Required |
| ----------- | ----------------------- | -------- |
| title       | Feature title           | Yes      |
| icon        | Font Awesome icon class | Yes      |
| description | Detailed description    | Yes      |

## Example

```markdown
{{<features-list cols="3">}}
- title: Open-source
  icon: fas fa-code
  description: Wide variety of vendors and individuals opens new opportunities...
- title: Reliable
  icon: fas fa-thumbs-up
  description: Over 10 million people use Xen with an ecosystem...
{{</features-list>}}
```

## Technical Notes

- The component uses Font Awesome for icons
- Content is parsed as YAML using the `transform.Unmarshal` function
- Each item is rendered using the `feature-item.html` partial
- Layout is managed via CSS using the `features-list` class
```
