# Header and Footer

The header and footer are dynamically generated. To add a new link, you need to configure the front matter of the page you want to add.
You must not edit the Header.

Example:

```markdown
---
title: Matrix
header: false
footer: false
menus:
  main:
    parent: Resources
    weight: 70
---
```

In this example:

- `parent` specifies the parent category of the page
- `weight` determines the display order of the page within its category


By default all pages are displayed in the header and footer, but you can hide them by setting `header: false` or `footer: false`.

- `header` determines if the page is displayed in the header
- `footer` determines if the page is displayed in the footer



For more information about the front matter, you can read the [Front matter documentation](page-editing.md#front-matter)


## Header

The header is generated from the `hugo.yaml` file and from the page, you must not edit the header.
If you need to edit the header, you can do it in the `themes/xen-project/layouts/partials/header.html` file. But be careful to not break the header.


## Footer

The footer is generated from the `hugo.yaml` file and from the page, you can edit the footer in the file `themes/xen-project/layouts/partials/footer.html` for some text, but you must be careful to not break the footer.


