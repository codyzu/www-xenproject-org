// Import styles
import "../static/font-awesomepro/fontawesome.css";
import "../static/font-awesomepro/regular.css";
import "../static/font-awesomepro/solid.css";
import "../static/font-awesomepro/brands.css";

import "../themes/xen-project/assets/css/main.scss";

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};

export default preview;
