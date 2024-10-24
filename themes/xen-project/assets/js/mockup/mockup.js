import style from "./mockup-style.js";
import mockupHide from "./mockup-hide.js";
import mockupUpload from "./mockup-upload.js";
import mockupOpacity from "./mockup-opacity.js";
import mockupPosition from "./mockup-position.js";
import mockupBlendMode from "./mockup-blend-mode.js";
import mockupWindowSize from "./mockup-window-size.js";
import mockupToolbarScale from "./mockup-toolbar-scale.js";
import mockupToolbarToggle from "./mockup-toolbar-toggle.js";
import mockupKeyboardShortcuts from "./mockup-keyboard-shortcuts.js";

const modules = [
  // mockupHide,
  mockupKeyboardShortcuts,
  mockupToolbarScale,
  mockupToolbarToggle,
  mockupWindowSize,
  mockupUpload,
  mockupOpacity,
  mockupPosition,
  mockupBlendMode,
];
(() => {
  const mockupCookie = document.cookie.split("; ").find((cookie) => cookie.startsWith("mockup"));
  if (mockupCookie) {
    if (mockupCookie.split("=")[1] === "disabled") {
      return null;
    }
  }

  const html = `
    <div class="mockup-toolbar-buttons">
      {{toolbarModules}}
    </div>
    <div class="mockup-toolbar-content">
      <div class="buttons">
        {{modules}}
      </div>
    </div>
  `;
  const toolbar = document.createElement("div");
  toolbar.className = "mockup-toolbar";

  const imageOnlockCallbacks = [];
  const mockup = {
    image: null,
    imageOnload: (callback) => {
      if (callback) {
        imageOnlockCallbacks.push(callback);
      } else {
        imageOnlockCallbacks.forEach((callback) => callback());
      }
    },
  };

  // apply modules
  toolbar.innerHTML = html
    .replace("{{modules}}", modules.map((module) => module.html).join(""))
    .replace("{{toolbarModules}}", modules.map((module) => module.toolbarHtml || "").join(""));

  style(modules.map((module) => module.css).join(""));
  modules.forEach((module) => module.js({ toolbar, mockup, saveToLocalStorage, loadFromLocalStorage }));

  function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  document.body.appendChild(toolbar);
})();
