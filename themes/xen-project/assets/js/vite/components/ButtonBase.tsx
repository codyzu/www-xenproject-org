import clsx from 'clsx';
import { FunctionalComponent } from 'preact';

type ButtonBaseProps = {
  class?: string;
  icon: string;
  iconPosition?: 'left' | 'right';
} & ({
 onClick: () => void;
} | {
  href: string;
  target?: string;
})

const ButtonBase: FunctionalComponent<ButtonBaseProps> = (props) => {
  const isLink = 'href' in props;

  const {
    class: customClasses,
    icon,
    iconPosition = 'right',
  } = props;

  const allClasses = clsx(
    "uno-inline-flex uno-flex-wrap uno-items-center uno-flex-row uno-gap-x-4 uno-py-3 uno-rounded-lg uno-bg-action",
    "uno-text-white uno-text-xl uno-px-7 uno-font-light uno-cursor-pointer",
    "uno-border-none uno-decoration-none uno-outline-offset-4",
    "hover:uno-bg-action-hover active:uno-bg-action-active hover:uno-decoration-none focus:uno-outline-action uno-outline-4",
    "uno-transition-all uno-duration-300 uno-ease-in-out uno-parent",
    customClasses)

  const iconElement = (
    <div
      class={clsx(
        icon,
        "uno-transition-transform uno-duration-300 uno-ease-in-out uno-text-lg",
        iconPosition === 'left' ? 'parent-hover:uno-translate-x-[-0.3em]' : 'parent-hover:uno-translate-x-[0.3em]',
      )}
    />)

  if (isLink) {
    return (
      <a
        href={props.href}
        target={props.target ?? "_blank"}
        rel="noopener noreferrer"
        class={allClasses}
      >
        {iconPosition === 'left' && iconElement}
        {props.children}
        {iconPosition === 'right' && iconElement}
      </a>
    );
  }
  
  return (
    <button
      type="button"
      class={allClasses}
      onClick={props.onClick}
    >
      {iconPosition === 'left' && iconElement}
      {props.children}
      {iconPosition === 'right' && iconElement}
    </button>
  )
};

export default ButtonBase;
