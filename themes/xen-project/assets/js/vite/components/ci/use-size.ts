import {useState, useLayoutEffect} from 'preact/hooks';
import useResizeObserver from '@react-hook/resize-observer';
import {type RefObject} from 'preact';

export default function useSize(target: RefObject<HTMLElement>) {
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
