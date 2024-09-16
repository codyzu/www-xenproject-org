import "../public/font-awesomepro/fontawesome.css"; // Adjust the path as needed
import "../public/font-awesomepro/regular.css";
import "../public/font-awesomepro/solid.css";
import "../public/font-awesomepro/brands.css";

import "../themes/xen-project/assets/css/main.scss"; // Adjust the path as needed

/** @type { import('@storybook/web-components').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
