import clsx from 'clsx';
import { FunctionalComponent } from 'preact';
import ButtonBase from './ButtonBase';

const ButtonExternalLink: FunctionalComponent<{
  href?: string;
  class?: string;
}> = ({
  href = '',
  class: customClasses,
  children,
}) => {
  return <ButtonBase href={href} class={customClasses} icon="i-fa6-solid-arrow-up-right-from-square">{children}</ButtonBase>;
};

export default ButtonExternalLink;
