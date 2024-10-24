import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Molecules/Button",
  tags: ["autodocs"],
  render: (args) => html` <button type="button" class="btn btn-primary">Primary button</button> `,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AllButtons = {
  render: (args) => html`
    <h2>Buttons as "button" tag</h2>
    <button type="button" class="btn btn-primary">Primary button</button>
    <button type="button" class="btn btn-secondary">Secondary button</button>
    <button type="button" class="btn btn-tertiary">Tertiary button</button>

    <h2>Buttons as "a" tag</h2>
    <a href="/" class="btn btn-primary"> Primary button </a>
    <a href="/" class="btn btn-secondary"> Secondary button </a>
    <a href="/" class="btn btn-tertiary"> Tertiary button </a>

    <h2>Buttons with icons</h2>
    <button type="button" class="btn btn-primary">
      Primary button with "arrow-right" icon
      <i class="fas fa-arrow-right"></i>
    </button>
    <button type="button" class="btn btn-secondary">
      Secondary button with "download" icon
      <i class="fas fa-download"></i>
    </button>

    <a href="/" class="btn btn-tertiary">
      Tertiary button with "arrow-up-right-from-square" icon
      <i class="fas fa-arrow-up-right-from-square"></i>
    </a>
  `,
};
