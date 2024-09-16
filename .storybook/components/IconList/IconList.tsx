import React, { useState } from "react";
import IconItem from "../IconItem/IconItem";
import { IconGallery } from "@storybook/blocks";
import StoryToggle from "../StoryToggle/StoryToggle";

interface IconListProps {
  icons: {
    [gallery: string]: string[];
  };
}

const IconList: React.FC<IconListProps> = ({ icons }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <label>Search for an icon</label>
      <input type="search" placeholder="Search" className="input input--text sb-search-input" onChange={onChange} />
      <div>
        {Object.keys(icons).map((gallery, index) => (
          <div key={gallery} className="story-icon-gallery">
            <StoryToggle title={gallery} open={true}>
              <p className="story-icon-description">
                Usage : <code>{gallery} fa-icon</code>
              </p>
              <IconGallery key={index}>
                {icons[gallery]
                  .filter((icon) => icon.includes(searchTerm))
                  .map((icon, index) => (
                    <IconItem key={index} name={icon} icon={`${gallery} ${icon}`} prefixOnCopy={`${gallery} `} />
                  ))}
              </IconGallery>
            </StoryToggle>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconList;
