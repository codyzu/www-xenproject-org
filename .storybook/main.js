/** @type { import('@storybook/web-components-vite').StorybookConfig } */

import remarkGfm from "remark-gfm";
const { mergeConfig } = require("vite");
const path = require("path");

const config = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  viteFinal: async (config, { configType }) => {
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ["legacy-js-api"],
            additionalData: `
            @import "./.storybook/storybook.scss";
            `,
          },
        },
      },
    });
  },
};
export default config;
