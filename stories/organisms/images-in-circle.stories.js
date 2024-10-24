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
Le composant **ImagesInCircle** utilise un partial et un shortcode pour afficher des images dans un cercle. 
- **Shortcode**: Le shortcode \`images-in-circle\` prend une classe CSS optionnelle et un contenu JSON pour les images. 
- **Partial**: Le partial \`images-in-circle.html\` génère une liste d'images avec des transformations CSS appliquées.

### Utilisation
1. **Shortcode**: Utilisez le shortcode dans vos fichiers de contenu pour inclure des images en cercle.
   \`\`\`html
   {{</* images-in-circle class="custom-class" */>}}
   [
     {"name": "Image1", "src": "/path/to/image1.jpg", "scale": "1.0"},
     {"name": "Image2", "src": "/path/to/image2.jpg", "scale": "1.2"}
   ]
   {{</* /images-in-circle */>}}
   \`\`\`

2. **Partial**: Le partial est utilisé pour rendre les images avec les styles appropriés.
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
