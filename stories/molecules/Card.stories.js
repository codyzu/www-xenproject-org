import { html } from "lit";

export default {
  title: "Molecules/Card",
  tags: ["autodocs"],
  render: (args) => html`
    <script>
      let i = 0;
      const classes = ["", "card--news", "card--bg"];
      setInterval(() => {
        document.getElementById("card").classList.remove(...classes.filter(c=>c!=""));
        const j = i % classes.length;
        i++;
        var newClass = classes[j];
        if(newClass) {
          document.getElementById("card").classList.add(newClass);
        }
      }, 1000);
    </script>
    <div class="card " id="card">
      <div class="label">Card</div>
      <div class="tags">
        <span class="tag">Tag 1</span>
        <span class="tag">Tag 2</span>
        <span class="tag">Tag 3</span>
      </div>
      <p class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non
        eros varius, tincidunt
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
      ${["", "card--news", "card--bg"].map(
        (cls) => html`
        <div class="card ${cls}">
          <a href="/newpage" class="card__link" aria-hidden="true" tabindex="-1"></a>
          <div class="card__label">Conversation Card ${cls.replace(/card--/g, "")}</div>
          <div class="card__date">aug, 5th 2024</div>
          <div class="card__tags">
            <a class="card__tag">Tag 1</a>
            <a class="card__tag">Tag 2</a>
            <a class="card__tag">Tag 3</a>
          </div>
          <p class="card__content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non
            eros varius, tincidunt tellus sit amet, maximus urna.
          </p>
          <div class="card__author">
            by <a href="/">John Doe</a>
          </div>
          <div class="card__actions">
            <a href="/newpage" 
              >Join <i class="fas fa-arrow-up-right-from-square"></i
            ></a>
            <a href="/" >Join
            <i class="fas fa-arrow-up-right-from-square"></i
            ></a></a>
          </div>
        </div>`,
      )}
    </div>
  `,
};
