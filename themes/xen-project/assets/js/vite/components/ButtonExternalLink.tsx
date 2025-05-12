import clsx from 'clsx';
import {type ComponentChildren, type FunctionalComponent} from 'preact';
import ButtonBase from './ButtonBase.tsx';

export default function ButtonExternalLink({
  href = '',
  class: customClasses,
  children,
}: {
  readonly href?: string;
  readonly class?: string;
  readonly children: ComponentChildren;
}) {
  return (
    <ButtonBase href={href} class={customClasses} icon="i-fa6-solid-arrow-up-right-from-square">
      {children}
    </ButtonBase>
  );
}
