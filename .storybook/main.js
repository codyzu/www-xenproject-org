/** @type { import('@storybook/web-components-vite').StorybookConfig } */

import remarkGfm from "remark-gfm";
import { mergeConfig } from "vite";
import path from "path";

const config = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-docs",
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
  ],
  framework: { name: "@storybook/web-components-vite", options: {} },
  viteFinal: async (config, { configType }) => {
    return mergeConfig(config, {
      resolve: { alias: { "@": path.resolve(__dirname, "../") } },
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ["legacy-js-api"],
            additionalData: `
            @use "./storybook.scss";
            `,
          },
        },
      },
      optimizeDeps: { include: ["storybook-dark-mode"] },
    });
  },
};

export default config;
