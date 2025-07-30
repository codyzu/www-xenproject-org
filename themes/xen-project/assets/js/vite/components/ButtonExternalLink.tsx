import {type PropsWithChildren} from 'react';
import ButtonBase from './ButtonBase.tsx';

export default function ButtonExternalLink({
  href = '',
  class: customClasses,
  children,
}: PropsWithChildren<{
  readonly href?: string;
  readonly class?: string;
}>) {
  return (
    <ButtonBase href={href} class={customClasses} icon="i-fa6-solid-arrow-up-right-from-square">
      {children}
    </ButtonBase>
  );
}
