import { Description } from "@storybook/blocks";
import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export default {
  title: "Molecules/BoxResources",
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: null,
      },
      description: {
        story: `
## Description

This component only show on the left side of some pages.

## Usage

In the \`.md\` file :

- Add the parameter "resources" to the page parameters.
- Add the parameter "layout" with the value "single-with-aside".


\`\`\`yaml
---
title: Page title
layout: single-with-aside
resources:
  - name: Example resource
    url: https://example.com/docs
  - name: Label 2
    url: https://github.com/example/repo
---
\`\`\`

## Example
`,
      },
    },
  },
  render: (args) => html`
    <div class="box-resources">
      <h3 class="box-resources__title">Resources</h3>
      <ul>
        <li>
          <a href="https://example.com/docs" target="_blank">Exemple resource</a>
        </li>
      </ul>
    </div>
  `,
};

export const Example = {
  render: (args) => html`
    <div class="page-single">
      <div class="main-content page-single-aside with-aside">
        <aside class="page-aside">
          <div class="box-resources">
            <h3 class="box-resources__title">Resources</h3>
            <ul>
              <li>
                <a href="https://example.com/docs" target="_blank"
                  >Exemple resource
                  <i class="fas fa-arrow-up-right-from-square"></i>
                </a>
              </li>
              <li>
                <a href="https://github.com/example/repo" target="_blank"
                  >Label 2 <i class="fas fa-arrow-up-right-from-square"></i>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div class="page-content">
          <h1>Page title</h1>

          <div class="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non eros varius, tincidunt tellus sit
            amet, maximus urna.
          </div>
        </div>
      </div>
    </div>
  `,
};
