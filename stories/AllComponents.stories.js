import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const DEFAULT_COLUMNS = 3;

const storiesList = [
  {
    group: "Molecules",
    storiesContext: import.meta.glob("./molecules/*.stories.js"),
    stories: [],
  },
  {
    group: "Organisms",
    storiesContext: import.meta.glob("./organisms/*.stories.js"),
    stories: [],
  },
];

async function loadStories() {
  for (let group of storiesList) {
    const storyModules = await Promise.all(Object.values(group.storiesContext).map((module) => module()));
    group.stories = storyModules.map((module) => module.default);
  }
  return storiesList;
}

const AllComponentsTemplate = (args, { loaded: { stories } }) => {
  let columns = DEFAULT_COLUMNS;
  let zoom = 1;

  const updateColumns = (event) => {
    columns = event.target.value;
    document.querySelector(".component-grid").style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  };

  const updateZoom = (event) => {
    zoom = event.target.value;
    document.querySelectorAll(".component-content").forEach((el) => {
      el.style.transform = `scale(${zoom})`;
      el.style.width = `${100 / zoom}%`;
      el.style.height = `${100 / zoom}%`;
    });
  };

  const scaleContent = (element) => {
    const parent = element.parentElement;
    const scale = Math.min(parent.clientWidth / element.scrollWidth, parent.clientHeight / element.scrollHeight);
    element.style.transform = `scale(${scale})`;
    element.style.transformOrigin = "top left";
  };

  const observeContent = (element) => {
    const observer = new MutationObserver(() => scaleContent(element));
    observer.observe(element, { childList: true, subtree: true });
    scaleContent(element); // Initial scaling
  };

  return html`
    <style>
      body {
        background: #fff;
      }
      .component-grid {
        display: grid;
        grid-template-columns: repeat(${columns}, 1fr);
        gap: 20px;
      }
      .component-card {
        position: relative;
        border: 1px solid #e0e0e0;
        border-radius: 12px;

        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        max-width: 100%;
        max-height: 100%;
        background: #ededed;
      }
      .component-card:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
      .component-link {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
      }
      .component-title {
        margin: 0 0 16px 0;
        padding-bottom: 12px;
        border-bottom: 2px solid #f0f0f0;
        font-size: 1.2em;
        color: #333;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0;
        padding: 12px;
      }
      .component-content {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 12px;
        padding: 20px;
        transform-origin: top left;
        width: 100%;
        height: 100%;
      }
      .controls {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
      }
      .control-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    </style>
    <h1>All Components</h1>
    <div class="controls">
      <div class="control-group">
        <label for="columns">Columns:</label>
        <input id="columns" type="range" min="1" max="6" value="${columns}" @input="${updateColumns}" />
      </div>
      <div class="control-group">
        <label for="zoom">Zoom:</label>
        <input id="zoom" type="range" min="0.1" max="2" step="0.1" value="${zoom}" @input="${updateZoom}" />
      </div>
    </div>
    ${stories.map((group) => {
      return html`
        <h2>${group.group}</h2>
        <div class="component-grid">
          ${group.stories.map((story) => {
            const storyPath = story.title.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
            const href = `/?path=/docs/${storyPath}--docs`;
            return html`
              <div class="component-card">
                <a href="${href}" class="component-link" target="_parent"></a>
                <h3 class="component-title">${story.title}</h3>
                <div class="component-content" ref="${(el) => observeContent(el)}">${story.render()}</div>
              </div>
            `;
          })}
        </div>
      `;
    })}
  `;
};

export default {
  title: "All Components",
  loaders: [async () => ({ stories: await loadStories() })],
  parameters: {
    previewTabs: {
      "storybook/docs/panel": { hidden: true },
    },
    addons: { disable: true },
    showPanel: false,
  },
};

export const AllComponentsStory = AllComponentsTemplate.bind({});
