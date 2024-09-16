import React, { FC } from "react";
import "./StoryToggle.scss";
import { Unstyled } from "@storybook/blocks";

type Props = {
  className?: string;
  children?: React.ReactNode;
  title: string;
  open?: boolean;
};

const StoryToggle: FC<Props> = ({ children, className = "", title, open: openProp }) => {
  const [open, setOpen] = React.useState(openProp);

  const toggle = () => {
    setOpen(!open);
  };
  return (
    <div className={`story-toggle ${className} ${open ? "story-toggle--open" : ""}`}>
      <Unstyled>
        <h2 className="story-toggle__title" onClick={toggle}>
          {title}
        </h2>
      </Unstyled>
      {open ? <div className="story-toggle__content">{children}</div> : null}
    </div>
  );
};

export default StoryToggle;
