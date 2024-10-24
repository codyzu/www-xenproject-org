const mockupBlendMode = {
  html: `
  <div class="mockup-blend-mode">
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
  </div>
  `,
  css: `
    .mockup-toolbar .custom-select-wrapper {
      position: relative;
      user-select: none;
      width: 100%;
    }
    
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    const mockupBlendMode = toolbar.querySelector(".mockup-blend-mode");
    const customSelect = mockupBlendMode.querySelector(".custom-select");
    const customSelectTrigger = customSelect.querySelector(".custom-select__trigger");
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
