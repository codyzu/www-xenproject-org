const mockupToolbarScale = {
  toolbarHtml: `
    <button type="button" class="mockup-button scale-up hidden-when-closed" title="Scale up (Ctrl+G)"></button>
    <button type="button" class="mockup-button scale-down hidden-when-closed" title="Scale down (Ctrl+H)"></button>
  `,
  css: `
    .mockup-toolbar .mockup-button.scale-up:before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' fill='white'/%3E%3C/svg%3E");
    }
    .mockup-toolbar .mockup-button.scale-down:before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 13H5v-2h14v2z' fill='white'/%3E%3C/svg%3E");
    }
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    const scaleUpButton = toolbar.querySelector(".scale-up");
    const scaleDownButton = toolbar.querySelector(".scale-down");
    let scale = loadFromLocalStorage("mockupToolbarScale") || 1;
    function updateToolbarScale() {
      toolbar.style.transform = `scale(${scale})`;
      saveToLocalStorage("mockupToolbarScale", scale);
    }
    function scaleUp() {
      scale += 0.5;
      updateToolbarScale();
    }
    function scaleDown() {
      scale = Math.max(0.8, scale - 0.5);
      updateToolbarScale();
    }
    scaleUpButton.addEventListener("click", scaleUp);
    scaleDownButton.addEventListener("click", scaleDown);
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "g") {
        event.preventDefault();
        scaleUp();
      } else if (event.ctrlKey && event.key === "h") {
        event.preventDefault();
        scaleDown();
      }
    });
    updateToolbarScale();
  },
};

export default mockupToolbarScale;
