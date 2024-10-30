const dbName = "MockupImagesDB";
const storeName = "images";

const mockupUpload = {
  html: `
  <div class="mockup-upload">
    <div class="mockup-upload-buttons">
      <label class="input-file-container" title="Load image (Ctrl+U)">
        <span class="input-file-label">Load image</span>
      <span class="input-file">
        <input type="file" accept="image/*"/>
          <span class="mockup-button choose-mockup"></span>
        </span>
      </label>
    </div>
    <div class="mockup-upload-images-list">
      <div class="custom-select-wrapper">
        <div class="custom-select" title="Select a saved image">
          <div class="custom-select__trigger"><span>Select a saved image</span></div>
          <div class="custom-options" id="savedImagesOptions">
            <!-- Options will be dynamically populated -->
          </div>
        </div>
      </div>
      <button id="clearHistoryBtn" class="clear-history-btn" title="Clear History">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-2 14H7L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M5 6l1-3h12l1 3"></path>
        </svg>
      </button>
    </div>
  </div>
  `,
  css: `
    .mockup-upload {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
    }
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
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 318.01 246.38"><path fill-rule="evenodd" d="M21.5.92c-3.85 1.14-7.96 3.24-10 5.1-.89.82-1.87 1.58-2.18 1.7C6.58 8.77 1.07 19.04.38 24.38c-.74 5.81-.3 197.7.46 200.2 1.05 3.43 2.3 6.2 2.78 6.2.22 0 .3.12.15.26-.57.57 2.46 5.3 5.12 7.97 3.37 3.4 6.38 5 12.03 6.38l3.98.97h116.2l116.22.02 2.98-.83c3.8-1.05 8.44-3.36 10.44-5.2.85-.8 1.61-1.38 1.7-1.31.11.13 7.17-7.11 8.13-8.36.85-1.1 3.57-6.86 4.11-8.7l1.23-4a33.84 33.84 0 0 0 1.4-5.22c.04-.34.3-1.03.56-1.53.27-.5.4-1.02.28-1.13-.12-.12.06-.75.4-1.4.33-.66.51-1.29.4-1.4-.12-.13.06-.75.4-1.4.33-.66.51-1.29.4-1.4-.12-.13.06-.75.4-1.4.33-.66.51-1.29.4-1.4-.12-.13.06-.75.4-1.4.33-.66.51-1.29.4-1.4-.12-.13.05-.74.38-1.38.33-.64.51-1.31.4-1.5-.1-.17.05-.66.37-1.08a3 3 0 0 0 .6-1.4c0-.34.36-1.78.81-3.2.44-1.4 1-3.28 1.24-4.16.24-.88.58-2.05.75-2.6.17-.55.53-1.81.8-2.8.27-.99.65-2.25.83-2.8.2-.55.42-1.45.5-2 .08-.55.26-1.27.4-1.6.13-.33.88-2.94 1.66-5.8a370.98 370.98 0 0 1 3.42-12.2c.78-2.82 1.28-4.55 1.51-5.2.12-.33.55-1.77.97-3.2l1.1-3.8a451.02 451.02 0 0 0 2.4-8.3c1.1-3.77 1.3-4.57 1.4-5.3.05-.44.3-1.25.51-1.8.23-.55.61-1.72.85-2.6l1.2-4.2c4.32-14.76 4.56-15.85 4.56-20.6 0-7.03-1.7-11.45-6.09-15.8-5.4-5.39-9.94-6.67-23.92-6.76l-5.7-.04v-6.34c0-3.49-.16-6.86-.35-7.5l-.88-2.96c-2.43-8.42-10.48-16.58-18.97-19.2-.88-.28-2-.66-2.5-.84-.5-.2-21.92-.35-47.6-.36-36.65 0-46.78-.1-47.15-.5a398.6 398.6 0 0 1-7.7-12.1c-3.96-6.38-8.12-13.05-9.24-14.82-3.9-6.18-10.2-11.17-16.4-12.95l-2.97-.88c-.65-.2-23.9-.34-52.6-.33L24.5.02l-3 .9m102 17.68c6.24 1.3 5.94.95 18.67 21.78 1.41 2.31 3.66 5.91 5 8 1.34 2.1 3.34 5.33 4.45 7.2 1.1 1.87 2.2 3.53 2.44 3.7.24.15 22.4.3 49.24.31 55.97.03 52.98-.17 57.08 3.74 2.82 2.7 3.36 4.34 3.77 11.54l.22 3.9-100.93.1c-74.8.1-101.2.23-101.94.57-.55.25-1.8.7-2.8.96-2.54.72-8.15 3.46-9.35 4.57-.55.5-1.08.85-1.17.75-.8-.8-10.69 10.87-10.06 11.9.13.2.06.36-.15.36-.55 0-1.86 3.28-3.04 7.6a308.1 308.1 0 0 1-2.23 8c-.17.55-.53 1.81-.8 2.8-.27 1-.63 2.25-.8 2.8a178.18 178.18 0 0 1-2 6.8 149.8 149.8 0 0 0-1.2 4c-.27 1-.63 2.25-.8 2.8-.17.55-.53 1.81-.8 2.8-.27 1-.63 2.25-.8 2.8-.17.55-.53 1.81-.8 2.8-.27 1-.68 2.3-.9 2.91-.22.62-.3 1.23-.16 1.37.14.13.06.48-.18.77a6 6 0 0 0-.78 1.84c-.4 1.56-1.09 4.05-1.58 5.71-.64 2.18-2.07 7.18-2.4 8.4-.18.66-.3-29.49-.26-67 .06-64.38.1-68.28.77-69.7 1.66-3.54 4.87-5.98 9.1-6.9 3.7-.83 91.24-.8 95.2.02m174.54 77.93a4.69 4.69 0 0 1 3.05 4.6c0 2.55-32.46 116-33.9 118.45-2.35 4.02-7.6 7.73-12.42 8.75-1.54.33-33 .45-115.62.45H25.66l-2.07-1.03c-2.57-1.28-4.09-3.02-4.09-4.67 0-.95 22-79.3 23.57-83.9.2-.55.56-1.8.83-2.8.27-.99.63-2.25.8-2.8.17-.55.53-1.8.8-2.8.27-.99.63-2.25.8-2.8.17-.55.5-1.72.75-2.6 2.34-8.47 5.34-18.48 5.9-19.66 1.68-3.54 6.84-7.8 11.04-9.12 2.6-.82 232.1-.88 234.06-.07"/></svg>');
    }
    
    .clear-history-btn {
      margin-left: 10px;
      padding: 5px; 
      font-size: 0.8em;
      background-color: #f44336;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
    }
    .clear-history-btn svg {
      fill: none;
      stroke: #ffffff;
      width: 16px;
      height: 16px;
    }
    .clear-history-btn:hover {
      background-color: #d32f2f;
    }
    .mockup-upload-images-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
   .mockup-upload .custom-options {
    left:auto;
    min-width:100%;
    white-space:nowrap;
   }
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    const mockupUpload = toolbar.querySelector(".mockup-upload");
    const input = mockupUpload.querySelector(".input-file input");
    const customSelect = mockupUpload.querySelector(".custom-select");
    const customSelectTrigger = customSelect.querySelector(".custom-select__trigger");
    const savedImagesOptions = mockupUpload.querySelector("#savedImagesOptions");
    const clearHistoryBtn = mockupUpload.querySelector("#clearHistoryBtn");

    async function processAndSaveImage(file) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      const imageBitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0);

      // Convert the image to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      saveToLocalStorage("mockupMockupImage", base64);
      createImage(base64);
      await saveImageToIndexedDB(base64, file.name);
      await loadSavedImages();
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
      mockup.image.src = base64; // Ensure this is a valid base64 string
      mockup.image.style.display = "block";
      let isVisibleFromlocation = loadFromLocalStorage("mockupMockupVisible");
      isVisibleFromlocation = isVisibleFromlocation === null ? true : isVisibleFromlocation;
      if (isVisibleFromlocation !== null) {
        isMockupVisible = isVisibleFromlocation;
        mockup.image.style.display = isMockupVisible ? "block" : "none";
      }
    }

    async function loadSavedImages() {
      const images = await getImagesFromIndexedDB();
      savedImagesOptions.innerHTML = ""; // Clear existing options
      images
        .sort((a, b) => (a.fileName < b.fileName ? -1 : 1))
        .forEach((image) => {
          const option = document.createElement("span");
          option.className = "custom-option";
          option.dataset.value = image.id;
          option.textContent = `${image.fileName.replace(/\..+$/, "")}`;
          savedImagesOptions.appendChild(option);

          option.addEventListener("click", async () => {
            const db = await openDB();
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            store.get(parseInt(option.dataset.value)).onsuccess = (event) => {
              const selectedImage = event.target.result;
              if (selectedImage.error) {
                console.error("Error getting image from IndexedDB:", selectedImage.error);
              } else {
                if (selectedImage?.data) {
                  createImage(selectedImage.data); // Use the base64 data directly
                  saveToLocalStorage("mockupMockupImage", selectedImage.data);
                  customSelectTrigger.textContent = option.textContent;
                  customSelect.classList.remove("open");
                } else {
                  console.error("Image data not found for ID:", option.dataset.value);
                }
              }
            };
          });
        });
    }

    customSelectTrigger.addEventListener("click", () => {
      customSelect.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      const isClickInside = customSelect.contains(e.target);
      if (!isClickInside) customSelect.classList.remove("open");
    });

    clearHistoryBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to clear all saved images?")) {
        await clearImageHistory();
        await loadSavedImages();
      }
    });

    window.addEventListener("load", () => {
      const savedImage = loadFromLocalStorage("mockupMockupImage");
      if (savedImage) {
        createImage(savedImage);
      }
      loadSavedImages();
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        input.click();
      }
    });
  },
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      resolve(db);
    };
  });
}

async function saveImageToIndexedDB(imageData, fileName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add({
      data: imageData, // Store the base64 data
      fileName: fileName,
      timestamp: Date.now(),
    });
    request.onerror = () => {
      console.error("Error saving image to IndexedDB:", request.error);
      reject(request.error);
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

async function getImagesFromIndexedDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onerror = () => {
      console.error("Error retrieving images from IndexedDB:", request.error);
      reject(request.error);
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

async function clearImageHistory() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export default mockupUpload;
