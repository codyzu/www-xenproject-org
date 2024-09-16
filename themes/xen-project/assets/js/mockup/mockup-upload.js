const mockupUpload = {
  html: `
    <label class="input-file-container" title="Load image (Ctrl+U)">
      <span class="input-file-label">Load image</span>
      <span class="input-file">
        <input type="file" accept="image/*"/>
        <span class="mockup-button choose-mockup"></span>
      </span>
    </label>
  `,
  css: `
    .mockup-toolbar .input-file {
      display: inline-block;
    }
    .mockup-toolbar .input-file-container .input-file-label {
      font-size: 0.8em;
    }
    .mockup-toolbar .input-file input {
      display: none;
    }
    .mockup-toolbar .mockup-button.choose-mockup:before {
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpolyline points='14 2 14 8 20 8' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    }
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    const input = toolbar.querySelector(".input-file input");
    async function processAndSaveImage(file) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      const imageBitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0);
      const webpBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.8),
      );
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(webpBlob);
      });
      console.log(base64.length);
      saveToLocalStorage("mockupMockupImage", base64);
      createImage(base64);
    }

    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      await processAndSaveImage(file);
    });

    function createImage(base64) {
      if (!mockup.image) {
        mockup.image = document.createElement("img");
        mockup.image.className = "mockupMockup-image";
        document.body.appendChild(mockup.image);
      }
      mockup.image.addEventListener("load", () => {
        mockup.imageOnload();
      });
      mockup.image.src = base64;
      mockup.image.style.display = "block";
      let isVisibleFromlocation = loadFromLocalStorage("mockupMockupVisible");
      isVisibleFromlocation =
        isVisibleFromlocation === null ? true : isVisibleFromlocation;
      if (isVisibleFromlocation !== null) {
        isMockupVisible = isVisibleFromlocation;
        mockup.image.style.display = isMockupVisible ? "block" : "none";
      }
    }

    window.addEventListener("load", () => {
      const savedImage = loadFromLocalStorage("mockupMockupImage");
      if (savedImage) {
        createImage(savedImage);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        input.click();
      }
    });
  },
};

export default mockupUpload;
