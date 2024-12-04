# Edit a page

To modify a page on the site, follow these steps:

## File Location

- All site pages are located in the `content` folder
- The homepage is located in the `content/_index.md` file

## File Format

Pages can be written using:
- Markdown for main content
- HTML for more complex layouts
- Yaml for the front matter

Both syntaxes can be mixed within the same file as needed.

## Best Practices

- Use Markdown for simple text content
- Reserve HTML for elements requiring specific formatting
- Always check how your changes look before publishing


## Front Matter

The front matter is the metadata at the top of each page file. It includes information like the page title, description, and other settings.

### Default Parameters

Based on analysis of typical pages, the front matter usually includes:

| Parameter   | Description                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| title       | The page title                                                                                                |
| description | A brief description of the page                                                                               |
| keywords    | Keywords for the page, used for SEO                                                                           |
| layout      | The layout type used for the page, all the pages use the layout "single"                                      |
| date        | Publication date (often used for blog posts)                                                                  |
| draft       | If the page is a draft, set to true, if the page is ready and published, set to false or delete the parameter |

These parameters help structure and organize the site content while providing useful metadata for SEO and navigation.

The parameters `title`, `description` are use for the main title and description of the page. You can see them at the top of the page.

The parameters `title`, `description` and `keywords` are used for SEO and are used to help search engines understand the content of the page.


### Show a page in the menu

By default, all the pages are shown in the menu. If you don't want to show a page in the menu, you can set the `hidden` parameter to `true`.

The pages are grouped into folders, but their position in the menu is determined by the `menu.main` and `weight` parameters.

To order the pages in the menu, you can set the `weight` parameter to the desired value. The lower the number, the higher up in the menu the page will be.

Example : 


Page downloads.md

```yaml
title: Downloads
menus:
  main:
    parent: Resources
    weight: 50
```

Page Matrix.md

```yaml
title: Matrix
menus:
  main:
    parent: Resources
    weight: 70
```

The page **Matrix** is after the page **Downloads** in the menu because it has a higher `weight` value.


