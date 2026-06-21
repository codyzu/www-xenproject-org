import {type EmblaCarouselType} from 'embla-carousel';
import clsx from 'clsx';
import {useCallback, useEffect, useState} from 'react';

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export function DotButton(props: {
  readonly index: number;
  readonly selectedIndex: number;
  readonly onDotButtonClick: (index: number) => void;
}) {
  return (
    <button
      type="button"
      className={clsx('uno-border-none')}
      aria-label={`Go to hardware slide ${props.index + 1}`}
      aria-current={props.index === props.selectedIndex ? 'true' : undefined}
      onClick={() => {
        props.onDotButtonClick(props.index);
      }}
    >
      <div
        className={clsx(
          props.index === props.selectedIndex ? 'i-fa6-solid-circle' : 'i-fa6-solid-circle-dot',
          'uno-w-8 uno-h-8',
          'uno-bg-action',
          'uno-transition-all',
          'hover:uno-bg-action-hover',
          'active:uno-bg-action-active',
          'focus:uno-outline-action',
          'uno-duration-300',
          'uno-ease-in-out',
          'uno-cursor-pointer',
        )}
      />
    </button>
  );
}
