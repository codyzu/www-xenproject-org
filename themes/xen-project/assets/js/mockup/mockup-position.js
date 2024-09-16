const imagePosition = {
  html: `
    <div class="module-content">
      <input type="number" class="position-input" name="position-input" placeholder="Image position" size="3" title="Image position (Ctrl+Arrows, Shift+Arrows=step 10)"/>
      <button type="button" class="mockup-button toggle-pointer-events" title="Toggle pointer events (Ctrl+P)"></button>
    </div>
  `,
  css: `
    .mockup-toolbar .mockup-button.toggle-pointer-events:before {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z"/></svg>');
    }
    .mockup-toolbar .mockup-button.toggle-pointer-events.active {
      background: #3a7c3c;
    }
    .mockup-toolbar .position-input {
      padding: 1px 2px;
      width: 60px;
    }
  `,
  js: ({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }) => {
    let isPointerEventsEnabled = false;
    let isDragging = false;
    let startY, startTop;
    let lastPosition;
    const positionInput = toolbar.querySelector(".position-input");
    const togglePointerEventsButton = toolbar.querySelector(
      ".toggle-pointer-events",
    );

    function updateImagePosition(position) {
      lastPosition = position;
      if (mockup.image) {
        mockup.image.style.top = `${position}px`;
        positionInput.value = position;
        saveToLocalStorage("mockupMockupPosition", position);
      }
    }

    function togglePointerEvents() {
      if (mockup.image) {
        isPointerEventsEnabled = !isPointerEventsEnabled;
        mockup.image.style.pointerEvents = isPointerEventsEnabled
          ? "auto"
          : "none";
        togglePointerEventsButton.style.background = isPointerEventsEnabled;
        togglePointerEventsButton.classList.toggle(
          "active",
          isPointerEventsEnabled,
        );

        saveToLocalStorage("mockupMockupPointerEvents", isPointerEventsEnabled);
      }
    }

    positionInput.addEventListener("change", (e) => {
      updateImagePosition(parseInt(e.target.value));
    });

    togglePointerEventsButton.addEventListener("click", togglePointerEvents);

    // Add keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "p") {
        togglePointerEvents();
      }
      if (isPointerEventsEnabled && mockup.image) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault(); // Prevent default page scrolling
          if (e.shiftKey) {
            // Shift + Arrow keys for 10px movement
            if (e.key === "ArrowDown") {
              updateImagePosition(lastPosition + 10);
            } else if (e.key === "ArrowUp") {
              updateImagePosition(lastPosition - 10);
            }
          } else {
            // Regular Arrow keys for 1px movement
            if (e.key === "ArrowDown") {
              updateImagePosition(lastPosition + 1);
            } else if (e.key === "ArrowUp") {
              updateImagePosition(lastPosition - 1);
            }
          }
        }
      }
    });

    // Add event listeners for dragging (mouse and touch)
    const startDrag = (e) => {
      if (
        isPointerEventsEnabled &&
        mockup.image &&
        (e.target === mockup.image || e.touches)
      ) {
        isDragging = true;
        startY = e.clientY || e.touches[0].clientY;
        startTop = lastPosition;
        e.preventDefault();
      }
    };

    const drag = (e) => {
      if (isDragging) {
        const clientY = e.clientY || e.touches[0].clientY;
        const deltaY = clientY - startY;
        const newPosition = startTop + deltaY;
        updateImagePosition(newPosition);
      }
    };

    const endDrag = () => {
      isDragging = false;
    };

    document.addEventListener("mousedown", startDrag);
    document.addEventListener("touchstart", startDrag);

    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);

    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);

    window.addEventListener("load", () => {
      const savedPosition = loadFromLocalStorage("mockupMockupPosition");
      updateImagePosition(savedPosition || 0);

      const savedPointerEvents = loadFromLocalStorage(
        "mockupMockupPointerEvents",
      );
      if (savedPointerEvents !== null) {
        isPointerEventsEnabled = savedPointerEvents;
        if (mockup.image) {
          mockup.image.style.pointerEvents = isPointerEventsEnabled
            ? "auto"
            : "none";
          togglePointerEventsButton.classList.toggle(
            "active",
            isPointerEventsEnabled,
          );
        }
      }
    });
  },
};

export default imagePosition;
