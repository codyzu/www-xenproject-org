import { FunctionalComponent } from 'preact';

interface IconButtonProps {
  href?: string;
  target?: string;
}

const IconButton: FunctionalComponent<IconButtonProps> = ({
  href = '',
  target = '_blank',
  children,
}) => {
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      class="uno-py-3 uno-rounded-lg uno-bg-action uno-text-white uno-text-xl uno-px-7 uno-font-light uno-border-none uno-decoration-none hover:uno-bg-action-hover uno-transition-all uno-duration-300 uno-inline-flex uno-flex-row uno-flex-wrap uno-items-center uno-gap-x-4 uno-ease-in-out uno-parent active:uno-bg-action-active hover:uno-decoration-none uno-cursor-pointer uno-outline-offset-4 focus:uno-outline-action uno-outline-4"
    >
      {children}
      <div
        class="i-fa6-solid-arrow-up-right-from-square uno-transition-transform parent-hover:uno-translate-x-[0.3em] uno-duration-300 uno-ease-in-out uno-text-lg"
      ></div>
    </a>
  );
};

export default IconButton;
