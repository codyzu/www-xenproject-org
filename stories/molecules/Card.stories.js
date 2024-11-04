import { html } from "lit";

export default {
  title: "Molecules/Card",
  tags: ["autodocs"],
  render: (args) => html`
    <div class="card card--small">
      <div class="label">Conversation Card</div>
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
        <a href="/" class="btn btn-tertiary join-button"
          >Join <i class="fas fa-arrow-up-right-from-square"></i
        ></a>
        <a href="/" class="btn btn-tertiary join-button">Join
        <i class="fas fa-arrow-up-right-from-square"></i
        ></a></a>
      </div>
    </div>
  `,
};

export const Card = {
  render: (args) => html`
    <div class="story-row ">
      ${["", "card--news"].map(
        (cls) => html`
        <div class="card ${cls}">
          <div class="card__label">Conversation Card ${cls.replace(/card--/g, "")}</div>
          <div class="card__date">aug, 5th 2024</div>
          <div class="card__tags">
            <span class="card__tag">Tag 1</span>
            <span class="card__tag">Tag 2</span>
            <span class="card__tag">Tag 3</span>
          </div>
          <p class="card__content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non
            eros varius, tincidunt tellus sit amet, maximus urna.
          </p>
          <div class="card__author">
            by <a href="/">John Doe</a>
          </div>
          <div class="card__actions">
            <a href="/" class="join-button"
              >Join <i class="fas fa-arrow-up-right-from-square"></i
            ></a>
            <a href="/" class="join-button">Join
            <i class="fas fa-arrow-up-right-from-square"></i
            ></a></a>
          </div>
        </div>`,
      )}
    </div>
  `,
};
