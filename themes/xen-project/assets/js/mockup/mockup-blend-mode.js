const mockupBlendMode = {
  html: `
    <div class="custom-select-wrapper">
      <div class="custom-select" title="Blend mode (Ctrl+B)">
        <div class="custom-select__trigger"><span>Normal</span></div>
        <div class="custom-options">
          <span class="custom-option selected" data-value="normal">Normal</span>
          <span class="custom-option" data-value="difference">Difference</span>
          <span class="custom-option" data-value="exclusion">Exclusion</span>
        </div>
      </div>
    </div>
  `,
  css: `
    .mockup-toolbar .custom-select-wrapper {
      position: relative;
      user-select: none;
      width: 100%;
    }
    .custom-select {
      position: relative;
      display: flex;
      flex-direction: column;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .custom-select__trigger {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 300;
      color: #3b3b3b;
      height: 24px;
      line-height: 24px;
      background: #ffffff;
      cursor: pointer;
      border-radius: 3px;
    }
    .custom-options {
      position: absolute;
      display: block;
      top: 100%;
      left: 0;
      right: 0;
      border: 1px solid #ccc;
      border-top: 0;
      background: #fff;
      transition: all 0.3s;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      z-index: 2;
    }
    .custom-select.open .custom-options {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }
    .custom-option {
      position: relative;
      display: block;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 300;
      color: #3b3b3b;
      line-height: 24px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .custom-option:hover {
      cursor: pointer;
      background-color: #f0f0f0;
    }
    .custom-option.selected {
      color: #ffffff;
      background-color: #305c91;
    }
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    const customSelect = toolbar.querySelector(".custom-select");
    const customSelectTrigger = customSelect.querySelector(
      ".custom-select__trigger",
    );
    const customOptions = customSelect.querySelectorAll(".custom-option");
    let currentModeIndex = 0;

    function closeSelectCustom() {
      customSelect.classList.remove("open");
    }

    function updateBlendMode(mode) {
      if (mockup.image) {
        mockup.image.style.mixBlendMode = mode;
        saveToLocalStorage("mockupMockupBlendMode", mode);
      }
    }

    function selectOption(option) {
      customSelectTrigger.textContent = option.textContent;
      customOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      closeSelectCustom();
      updateBlendMode(option.getAttribute("data-value"));
    }

    function cycleBlendMode() {
      currentModeIndex = (currentModeIndex + 1) % customOptions.length;
      selectOption(customOptions[currentModeIndex]);
    }

    customSelectTrigger.addEventListener("click", () => {
      customSelect.classList.toggle("open");
    });

    customOptions.forEach((option, index) => {
      option.addEventListener("click", () => {
        currentModeIndex = index;
        selectOption(option);
      });
    });

    document.addEventListener("click", (e) => {
      const isClickInside = customSelect.contains(e.target);
      if (!isClickInside) closeSelectCustom();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "b" || e.key === "B") {
        cycleBlendMode();
      }
    });

    window.addEventListener("load", () => {
      const savedBlendMode = loadFromLocalStorage("mockupMockupBlendMode");
      if (savedBlendMode) {
        const savedOption = Array.from(customOptions).find(
          (option) => option.getAttribute("data-value") === savedBlendMode,
        );
        if (savedOption) {
          currentModeIndex = Array.from(customOptions).indexOf(savedOption);
          selectOption(savedOption);
        }
      }
    });
  },
};

export default mockupBlendMode;
