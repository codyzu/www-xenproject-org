import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Molecules/ProjectCard",
  tags: ["autodocs"],
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ProjectCard = {
  render: (args) => html`
    <div class="story-row">
      <div class="project-card">
        <h3>Label</h3>
        <div class="project-card__content">
          Label Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vestibulum non eros varius, tincidunt tellus sit amet, maximus urna.
        </div>
        <a href="/link" class="project-card__link btn btn-tertiary"
          >Discover <i class="fas fa-arrow-right"></i
        ></a>
      </div>
      <div class="project-card">
        <h3>Label</h3>
        <div class="project-card__content">
          Label Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vestibulum non eros varius, tincidunt tellus sit amet, maximus urna.
        </div>
        <a href="/link" class="project-card__link btn btn-tertiary"
          >Discover <i class="fas fa-arrow-right"></i
        ></a>
      </div>
    </div>
  `,
};
