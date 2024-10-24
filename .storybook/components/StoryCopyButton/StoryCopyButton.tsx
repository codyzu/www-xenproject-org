import React, { useState } from "react";
import "./StoryCopyButton.scss";

interface StoryCopyButtonProps {
  textToCopy: string;
  tooltipText?: string;
  children?: React.ReactNode;
}

const StoryCopyButton: React.FC<StoryCopyButtonProps> = ({
  textToCopy,
  tooltipText = "Copy to clipboard",
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.info("Text copied to clipboard");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      })
      .catch((err) => console.error("Error copying text:", err));
  };

  return (
    <div className="story-copy-button-container">
      <button className="story-copy-button" onClick={handleCopy} aria-label={tooltipText}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
        </svg>
        {" " + (children || "")}
      </button>
      <span className={`story-copy-button_tooltip ${showTooltip ? "visible" : ""}`}>Copied!</span>
    </div>
  );
};

export default StoryCopyButton;
