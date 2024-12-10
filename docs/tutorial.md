# Hugo Tutorial

This tutorial will guide you through the essential aspects of creating and managing content in Hugo, including page creation, block management, image handling, and Markdown basics.

## Creating a New Page

To create a new page in Hugo, follow these steps:

1. Navigate to the `content` directory of your Hugo project
2. Copy the template.md file in the content directory
3. rename the markdown file and place it in the section you want
4. Modify the front matter at the top of your file:
   ```yaml
   ---
   title: "My New Page"
   description: ""
   keywords: 
   draft: false
   ---
   ```
5. Add your content below the front matter

## Adding Blocks

To add blocks to your pages:

1. blocks of a page are always inside `{{<section>}}` block
  ```markdown
    {{<section>}}   
      content
    {{</section>}}
  ```
2. Common components types:

All Component can be seen in the page docs/page-components.md
   

3. Image placement:
   - Store images in the `static/img` directory
   - Reference them using absolute paths : `/img/<subfolder>/<filename>`
   

## Writing in Markdown

You can write in markdown in the content of components. If sometimes it doesn't work, you can use the tag `{{<md>}} {{</md>}}` to wrap your markdown code.

Here's a quick reference for common Markdown syntax:

### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
```

### Text Formatting
```markdown
*Italic text*
**Bold text**
***Bold and italic text***
~~Strikethrough~~
```

### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Second item
   1. Nested ordered item
```

### Links
```markdown
[Link text](https://example.com)
[Internal link]({{< ref "/posts/my-post.md" >}})
```

### Code Blocks
````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

### Tables
```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Blockquotes
```markdown
> This is a blockquote
> Multiple lines
```

Remember to:
- Use preview mode in your editor to check formatting
- Keep your Markdown clean and consistent
- Follow your project's style guide
- Test your pages locally before publishing

For more advanced features, consult the [Hugo documentation](https://gohugo.io/documentation/).
