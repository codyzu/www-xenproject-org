import {useState, useLayoutEffect, type RefObject} from 'react';
import useResizeObserver from '@react-hook/resize-observer';

// eslint-disable-next-line @typescript-eslint/no-restricted-types
export default function useSize(target: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    if (target.current === null) {
      return;
    }

    setSize(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => {
    setSize(entry.contentRect);
  });

  return size;
}
