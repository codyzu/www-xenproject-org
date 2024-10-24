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
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpolyline points='14 2 14 8 20 8' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
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

      await saveImageToIndexedDB(base64, file.name);
      saveToLocalStorage("mockupMockupImage", base64);
      createImage(base64);
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
      images.forEach((image) => {
        const option = document.createElement("span");
        option.className = "custom-option";
        option.dataset.value = image.id;
        option.textContent = `${image.fileName} (${new Date(image.timestamp).toLocaleString()})`;
        savedImagesOptions.appendChild(option);

        option.addEventListener("click", async () => {
          const db = await openDB();
          const transaction = db.transaction(storeName, "readonly");
          const store = transaction.objectStore(storeName);
          const selectedImage = await store.get(parseInt(option.dataset.value));
          if (selectedImage.result && selectedImage.result.data) {
            createImage(selectedImage.result.data); // Use the base64 data directly
            customSelectTrigger.textContent = option.textContent;
            customSelect.classList.remove("open");
          } else {
            console.error("Image data not found for ID:", option.dataset.value);
          }
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
