const mockupWindowSize = {
  toolbarHtml: `
  <button type="button" class="mockup-button toggle-toolbar"></button>
  `,
  css: `
    .mockup-toolbar.collapsed .mockup-toolbar-content,
    .mockup-toolbar.collapsed .hidden-when-closed{
      display: none;
    }
    .mockup-toolbar .mockup-button.toggle-toolbar:before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' fill='white'/%3E%3C/svg%3E");
    }

  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    const toggleToolbarButton = toolbar.querySelector(".toggle-toolbar");

    let isToolbarCollapsed = false;
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    toggleToolbarButton.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTop = parseInt(getComputedStyle(toolbar).top);
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      toolbar.style.top = `${startTop + dy}px`;
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        saveToLocalStorage("mockupToolbarPosition", {
          top: parseFloat(toolbar.style.top, 10),
        });
      }
    });

    const toggleToolbar = () => {
      if (isDragging) return;
      isToolbarCollapsed = !isToolbarCollapsed;
      toolbar.classList.toggle("collapsed", isToolbarCollapsed);
      saveToLocalStorage("mockupToolbarCollapsed", isToolbarCollapsed);
    };

    toggleToolbarButton.addEventListener("click", toggleToolbar);

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        toggleToolbar();
      }
    });

    const savedToolbarState = loadFromLocalStorage("mockupToolbarCollapsed");
    if (savedToolbarState !== null) {
      isToolbarCollapsed = savedToolbarState;
      toolbar.classList.toggle("collapsed", isToolbarCollapsed);
    }
    const savedToolbarPosition = loadFromLocalStorage("mockupToolbarPosition");

    if (savedToolbarPosition) {
      if (savedToolbarPosition.top > window.innerHeight) {
        savedToolbarPosition.top = 10;
      }
      toolbar.style.top = savedToolbarPosition.top + "px";
    }
  },
};

export default mockupWindowSize;
