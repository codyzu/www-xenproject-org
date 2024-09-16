import { html } from "lit";

export default {
  title: "Molecules/ConversationCard",
  tags: ["autodocs"],
};

export const ProjectCard = {
  render: (args) => html`
    <div class="story-row">
      ${["", "small"].map(
        (size) => html`
        <div class="conversation-card ${size ? `conversation-card--${size}` : ""}">
          <div class="label">Conversation Card ${size}</div>
          <div class="tags">
            <span class="tag">Tag 1</span>
            <span class="tag">Tag 2</span>
            <span class="tag">Tag 3</span>
          </div>
          <p class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non
            eros varius, tincidunt tellus sit amet, maximus urna.
          </p>
          <div class="actions">
            <a href="TODO" class="btn btn-ternary join-button"
              >Join <i class="fas fa-arrow-up-right-from-square"></i
            ></a>
            <a href="TODO" class="btn btn-ternary join-button">Join
            <i class="fas fa-arrow-up-right-from-square"></i
            ></a></a>
          </div>
        </div>`,
      )}
    </div>
  `,
};
