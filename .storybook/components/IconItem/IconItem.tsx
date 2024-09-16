import React, { FC, useState } from "react";
import "./IconItem.scss";

interface IconItemProps {
  icon: string;
  name: string;
  prefixOnCopy?: string;
}

const IconItem: FC<IconItemProps> = ({ icon, name, prefixOnCopy = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const copyString = prefixOnCopy + name;
    navigator.clipboard.writeText(copyString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="icon-item" onClick={handleCopy}>
      <div className="icon">
        <i className={icon} />
      </div>
      <div className="icon-name">{name}</div>
      {copied && <span className="icon-copied">Copied!</span>}
    </div>
  );
};

export default IconItem;
