const style = `
.mockup-toolbar {
  align-items: center;
  background: #f0f0f0;
  border: 1px solid #000;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: stretch;
  justify-content: flex-end;
  padding: 5px;
  position: fixed;
  right: 5px;
  scale: 0.8;
  top: 20px;
  transform-origin: top right;
  z-index: 99999;
  letter-spacing: 0em;
}
.mockup-toolbar .buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.mockup-toolbar .mockup-button {
  align-items: center;
  background: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 1em;
  justify-content: center;
  padding: 8px;
  text-align: center;
  position: relative;
}
.mockup-toolbar .mockup-button.no-before:before {
  content: none;
  display: none;
}
.mockup-toolbar .mockup-button:before {
  background-repeat: no-repeat;
  background-size: contain;
  content: "";
  display: inline-block;
  height: 1em;
  width: 1em;
}
.mockup-toolbar .mockup-button:hover {
  background: #45a049;
}

.mockup-toolbar .mockup-toolbar-buttons {
  display: flex;
  gap: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: right;
  margin-left: auto;
}
.mockup-toolbar .mockup-toolbar-buttons .mockup-button {
  font-size: 1em;
  position: relative;
  width: 1.5em;
  aspect-ratio: 1;
}
  
.mockup-toolbar .mockup-toolbar-buttons .mockup-button:before {
  position: absolute;
  inset: 0.2em;
  background-size: contain;
  width: auto;
  height: auto; 
}

.mockup-toolbar-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mockupMockup-image {
  left: 0;
  opacity: 0.8;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9000;
}
.mockup-toolbar .module-content {
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: flex-end;
  align-items: center;
}
`;

const mockupStyle = (addStyle) => {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = style + "\n" + addStyle;
  document.head.appendChild(styleEl);
};

export default mockupStyle;
