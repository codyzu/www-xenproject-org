const mockupWindowSize = {
  html: `
    <div class="mockup-window-size">
      <div>
        <span class="comparison-sign"></span>
        <span class="size-display"></span>
      </div>
      <span class="image-size"></span>
    </div>
  `,
  css: `
    .mockup-toolbar .mockup-window-size {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      font-size: 10px;
    }
    .mockup-toolbar .mockup-window-size .comparison-sign {
      margin-right: 5px;
      font-weight: bold;
      font-size:1.2em;
    }
    .mockup-toolbar .mockup-window-size .size-display {
      display: inline-block;
      padding: 2px 13px;
      color: white;
      border-radius: 3px;
      background-color: rgba(255, 0, 0, 0.7);
    }
    .mockup-toolbar .mockup-window-size .size-display.natural-width {
      background-color: rgba(0, 128, 0, 0.7);
    }
    .mockup-toolbar .mockup-window-size .image-size {
      margin-left: 10px;
      color: #888;
    }
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    const windowSizeElement = toolbar.querySelector(".mockup-window-size");
    const comparisonSignElement =
      windowSizeElement.querySelector(".comparison-sign");
    const sizeDisplayElement = windowSizeElement.querySelector(".size-display");
    const imageSizeElement = windowSizeElement.querySelector(".image-size");

    function updateWindowSize() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (mockup.image === null) {
        comparisonSignElement.textContent = "";
        sizeDisplayElement.textContent = `${windowWidth} x ${windowHeight}`;
        imageSizeElement.textContent = "";
        return;
      }

      const imageWidth = mockup.image.naturalWidth;
      const imageHeight = mockup.image.naturalHeight;
      let comparisonSign = "=";

      if (windowWidth < imageWidth) {
        comparisonSign = "<";
      } else if (windowWidth > imageWidth) {
        comparisonSign = ">";
      } else {
        comparisonSign = "=";
      }

      comparisonSignElement.textContent = comparisonSign;
      sizeDisplayElement.textContent = `${windowWidth} x ${windowHeight}`;
      imageSizeElement.textContent = `(Image: ${imageWidth} x ${imageHeight})`;

      if (windowWidth === imageWidth) {
        sizeDisplayElement.classList.add("natural-width");
      } else {
        sizeDisplayElement.classList.remove("natural-width");
      }
    }

    window.addEventListener("load", updateWindowSize);
    window.addEventListener("resize", updateWindowSize);

    mockup.imageOnload(updateWindowSize);
  },
};

export default mockupWindowSize;
