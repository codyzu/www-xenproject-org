const mockupOpacity = {
  html: `
    <div class="module-content">
      <input name="opacity" type="range" min="0" max="100" value="80" class="opacity-slider" title="Image opacity (Ctrl+J/L)"/>
      <button type="button" class="mockup-button toggle-mockup" title="Toggle image visibility (Ctrl+K)"></button>
    </div>
  `,
  css: `
    .mockup-toolbar .mockup-button.toggle-mockup::before {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
    }
    .mockup-toolbar .mockup-button.toggle-mockup.hidden::before {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'/%3E%3C/svg%3E");
    }
    .mockup-toolbar .opacity-slider {width: 60px;}
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    let isMockupVisible;
    const toggleButton = toolbar.querySelector(".toggle-mockup");
    const opacitySlider = toolbar.querySelector(".opacity-slider");

    const toggleMockup = () => {
      if (mockup.image) {
        isMockupVisible = !isMockupVisible;
        mockup.image.style.display = isMockupVisible ? "block" : "none";
        toggleButton.classList.toggle("hidden", !isMockupVisible);
        saveToLocalStorage("mockupMockupVisible", isMockupVisible);
      }
    };

    const changeOpacity = (delta) => {
      if (mockup.image) {
        let newValue = parseInt(opacitySlider.value) + delta;
        newValue = Math.max(0, Math.min(100, newValue));
        opacitySlider.value = newValue;
        mockup.image.style.opacity = newValue / 100;
        saveToLocalStorage("mockupMockupOpacity", newValue);
      }
    };

    toggleButton.addEventListener("click", toggleMockup);

    opacitySlider.addEventListener("input", (e) => {
      if (mockup.image) {
        mockup.image.style.opacity = e.target.value / 100;
        saveToLocalStorage("mockupMockupOpacity", e.target.value);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "j":
            changeOpacity(-5);
            break;
          case "l":
            changeOpacity(5);
            break;
          case "k":
            toggleMockup();
            break;
        }
      }
    });

    mockup.imageOnload(() => {
      const savedOpacity = loadFromLocalStorage("mockupMockupOpacity");
      if (savedOpacity !== null) {
        opacitySlider.value = savedOpacity;
        if (mockup.image) {
          mockup.image.style.opacity = savedOpacity / 100;
        }
      }

      const savedVisible = loadFromLocalStorage("mockupMockupVisible");
      if (savedVisible !== null) {
        isMockupVisible = savedVisible;
        if (mockup.image) {
          mockup.image.style.display = isMockupVisible ? "block" : "none";
          toggleButton.classList.toggle("hidden", !isMockupVisible);
        }
      }
    });
  },
};

export default mockupOpacity;
