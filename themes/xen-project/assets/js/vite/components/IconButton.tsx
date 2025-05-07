import clsx from 'clsx';
import { FunctionalComponent } from 'preact';

interface IconButtonProps {
  href?: string;
  target?: string;
  class?: string;
}

const IconButton: FunctionalComponent<IconButtonProps> = ({
  href = '',
  target = '_blank',
  class: customClasses,
  children,
}) => {
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      class={clsx(
        "uno-inline-flex uno-flex-wrap uno-items-center uno-flex-row uno-gap-x-4 uno-py-3 uno-rounded-lg uno-bg-action",
        "uno-text-white uno-text-xl uno-px-7 uno-font-light uno-cursor-pointer",
        "uno-border-none uno-decoration-none uno-outline-offset-4",
        "hover:uno-bg-action-hover active:uno-bg-action-active hover:uno-decoration-none focus:uno-outline-action uno-outline-4",
        "uno-transition-all uno-duration-300 uno-ease-in-out uno-parent",
        customClasses)}
    >
      {children}
      <div
        class="i-fa6-solid-arrow-up-right-from-square uno-transition-transform parent-hover:uno-translate-x-[0.3em] uno-duration-300 uno-ease-in-out uno-text-lg"
      ></div>
    </a>
  );
};

export default IconButton;
