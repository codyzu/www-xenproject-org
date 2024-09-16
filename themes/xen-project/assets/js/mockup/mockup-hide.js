/** Hide the toolbar
 * Ctrl+I : Toggle the visibility of the mockup toolbar
 */

const mockupHide = {
  toolbarHtml:
    '<button type="button" class="mockup-button hide-mockup hidden-when-closed" title="Hide mockup (Ctrl+I)"></button>',
  css: `
    .mockup-toolbar.hidden { visibility:hidden;}
    .mockup-toolbar .mockup-button.hide-mockup:before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 298 298'%3E%3Cpath d='M290 119.1h-11.3a36.9 36.9 0 0 0-30-22.7C237 94.5 206 94.1 206 94.1H92s-31 .4-42.8 2.3a36.9 36.9 0 0 0-30 22.7H8a8 8 0 0 0 0 16h7.6A74.2 74.2 0 0 0 25.8 177c17.6 29 55.2 41.2 93.4 2a76.3 76.3 0 0 0 21-33.4s.4-2.5.7-3.3c1.1-3.4 4.3-6.2 8-6.2h.2c3.6 0 6.7 2.7 8 6l.7 3.3a76.7 76.7 0 0 0 21 33.7c38.2 39.2 75.8 26.8 93.4-2.2a77.7 77.7 0 0 0 10-41.8h7.8a8 8 0 0 0 0-16zm-132.9 2.4c-2.5-.8-5.2-1.4-8-1.4h-.2c-2.8 0-5.5.6-8 1.4-1-4.2-2.8-7.4-5.2-11.4h26.6c-2.4 4-4.1 7.2-5.2 11.4z' fill='white'/%3E%3C/svg%3E");
    }
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    let isMockupVisible = true;

    const applyVisible = (state) => {
      isMockupVisible = state;
      if (mockup.image) {
        mockup.image.style.visibility = isMockupVisible ? "visible" : "hidden";
      }
      toolbar.classList.toggle("hidden", !isMockupVisible);
      saveToLocalStorage("mockupMockupVisible", isMockupVisible);
    };

    const toggleVisibility = () => applyVisible(!isMockupVisible);

    toolbar
      .querySelector(".hide-mockup")
      .addEventListener("click", toggleVisibility);

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "i") {
        event.preventDefault();
        toggleVisibility();
      }
    });

    mockup.imageOnload(() => {
      const savedVisible = loadFromLocalStorage("mockupMockupVisible");
      applyVisible(savedVisible !== null ? savedVisible : true);
    });
  },
};

export default mockupHide;
