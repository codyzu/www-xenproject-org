import { html } from "lit";

const images = [
  { name: "AMD", src: "/img/logos/amd-logo.svg", scale: "1.0" },
  { name: "AWS", src: "/img/logos/aws-logo.svg", scale: "1.0" },
  { name: "ARM", src: "/img/logos/arm-logo.svg", scale: "1.0" },
  { name: "EPAM", src: "/img/logos/epam-logo.svg", scale: "1.0" },
  { name: "XenServer", src: "/img/logos/xenserver-logo.svg", scale: "1.2" },
  { name: "VATES", src: "/img/logos/vates-logo.svg", scale: "1.0" },
];

// Documentation sur l'utilisation du partial et du shortcode
export default {
  title: "Organisms/ImagesInCircle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **ImagesInCircle** component uses a partial and a shortcode to display images in a circle.
- **Shortcode**: The \`images-in-circle\` shortcode takes an optional CSS class and JSON content for the images.
- **Partial**: The \`images-in-circle.html\` partial generates a list of images with applied CSS transformations.

### Usage
1. **Shortcode**: Use the shortcode in your content files to include images in a circle.
   \`\`\`html
   {{</* images-in-circle class="custom-class" */>}}
   [
     {"name": "Image1", "src": "/path/to/image1.jpg", "scale": "1.0"},
     {"name": "Image2", "src": "/path/to/image2.jpg", "scale": "1.2"}
   ]
   {{</* /images-in-circle */>}}
   \`\`\`

2. **Partial**: The partial is used to render the images with appropriate styles.
        `,
      },
    },
  },
  render: () => html`
    <ul class="images-in-circle">
      ${images.map(
        (image) => html`
          <li>
            <img src="${image.src}" alt="${image.name}" style="transform: scale(${image.scale});" />
          </li>
        `,
      )}
    </ul>
  `,
};

export const Example = {
  render: () => html`
    <ul class="images-in-circle">
      ${images.map(
        (image) => html`
          <li>
            <img src="${image.src}" alt="${image.name}" style="transform: scale(${image.scale});" />
          </li>
        `,
      )}
    </ul>
  `,
};
