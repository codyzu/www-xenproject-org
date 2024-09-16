import React, { useState } from "react";
import "./ShadowItem.scss";

const ShadowItem = ({ shadowClassName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const valueToCopy = shadowClassName;
    navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const classNames = `story-shadow `;

  return (
    <div className={`${classNames} story-box-sm story-background ${shadowClassName}`} onClick={handleCopy}>
      <code>{shadowClassName}</code>
      {copied && <span className="copied">Copied in clipboard</span>}
    </div>
  );
};

export default ShadowItem;
