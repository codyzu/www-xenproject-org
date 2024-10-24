import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Molecules/Anchor",
  tags: ["autodocs"],
  render: (args) => html` <a href="/" class="anchor">Anchor</a> `,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Anchor = {
  render: (args) => html` <a href="/" class="anchor">Anchor</a> `,
};
