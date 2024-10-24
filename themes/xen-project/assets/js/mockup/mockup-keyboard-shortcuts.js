export default {
  toolbarHtml: `
    <div class="mockup-keyboard-shortcuts">
      <button class="mockup-keyboard-shortcuts-toggle" title="Show/Hide keyboard shortcuts help (?)">
        <span class="icon">?</span>
      </button>
      <div class="mockup-keyboard-shortcuts-content" style="display: none;">
        <h4>Shortcuts</h4>
        <ul id="mockup-shortcuts-list"></ul>
      </div>
    </div>
  `,

  css: `
    .mockup-keyboard-shortcuts {
      position: relative;
    }
    .mockup-keyboard-shortcuts-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      font-size: 14px;
      color: #333;
    }
    .mockup-keyboard-shortcuts-toggle:hover {
      color: #000;
    }
    .mockup-keyboard-shortcuts-content {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: #f8f8f8;
      border: 1px solid #ddd;
      padding: 8px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      z-index: 1000;
      font-size: 12px;
      min-width: 250px;
      max-width: 340px; /* Set max width to 340px */
      width: max-content;
    }
    .mockup-keyboard-shortcuts-content h4 {
      margin: 0 0 5px 0;
      font-size: 14px;
    }
    .mockup-keyboard-shortcuts-content ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .mockup-keyboard-shortcuts-content li {
      margin-bottom: 3px;
    }
    .mockup-keyboard-shortcuts-content table {
      width: 100%;
      border-collapse: collapse;
    }
    .mockup-keyboard-shortcuts-content td {
      border: 1px solid #ddd; /* Light border for table cells */
      padding: 4px;
    }
  `,

  js: ({ toolbar }) => {
    const toggleButton = toolbar.querySelector(".mockup-keyboard-shortcuts-toggle");
    const content = toolbar.querySelector(".mockup-keyboard-shortcuts-content");
    const shortcutsTable = document.createElement("table");
    content.appendChild(shortcutsTable);

    function updateShortcutsTable() {
      shortcutsTable.innerHTML = ""; // Clear existing content
      toolbar.querySelectorAll("[title]").forEach((el) => {
        if (el.title.includes("(") && !el.classList.contains("mockup-keyboard-shortcuts-toggle")) {
          const shortcut = el.title.match(/\(([^)]+)\)/)[1];
          const description = el.title.replace(/\s*\([^)]*\)/, "").trim();
          const tr = document.createElement("tr");
          const tdShortcut = document.createElement("td");
          const tdDescription = document.createElement("td");
          tdShortcut.textContent = shortcut;
          tdDescription.textContent = description;
          tr.appendChild(tdShortcut);
          tr.appendChild(tdDescription);
          shortcutsTable.appendChild(tr);
        }
      });
    }

    toggleButton.addEventListener("click", (e) => {
      e.stopPropagation();
      updateShortcutsTable();
      content.style.display = content.style.display === "none" ? "block" : "none";
    });

    // Close the popup when clicking outside
    document.addEventListener("click", (e) => {
      if (!content.contains(e.target) && e.target !== toggleButton) {
        content.style.display = "none";
      }
    });
  },
};
