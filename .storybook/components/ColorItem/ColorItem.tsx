import React, { useState } from "react";
import "./ColorItem.scss";

const ColorItem = ({ title, subtitle, colors }) => {
  return (
    <div className="story-color-item">
      <div className="story-color-list">
        {colors.map(({ name, value, variableName }) => (
          <OneColor
            key={`${variableName}`}
            name={name}
            value={value}
            variableName={variableName}
          />
        ))}
      </div>
    </div>
  );
};

const OneColor = ({ name, value, variableName }) => {
  const [copied, setCopied] = useState("");

  const handleCopy = (variableName) => {
    navigator.clipboard.writeText(`var(${variableName})`);
    setCopied(variableName);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div
      key={`${variableName}`}
      className="story-color"
      onClick={() => handleCopy(variableName)}
    >
      <div
        className="story-color-swatch"
        style={{ backgroundColor: value }}
      ></div>
      <span className="story-color-variant-value">
        <span>{name}</span>
        <span>{value}</span>
      </span>
      <span className="story-color-variable-name">{variableName}</span>
      {copied === variableName && (
        <span className="story-color-copied">Copied!</span>
      )}
    </div>
  );
};

export default ColorItem;
