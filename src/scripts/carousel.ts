export function initializeCarousel(root: HTMLElement) {
  if (root.dataset.carouselReady === 'true') return;

  const rail = root.querySelector<HTMLElement>('.carousel');
  const firstItem = rail?.querySelector<HTMLElement>('.carousel-item:not(.carousel-item--clone)');
  const previousButton = root.querySelector<HTMLButtonElement>('.prev');
  const nextButton = root.querySelector<HTMLButtonElement>('.next');
  if (!rail || !firstItem || !previousButton || !nextButton) return;

  const spacer = firstItem.cloneNode() as HTMLElement;
  spacer.classList.remove('project-carousel-card', 'card--news');
  spacer.classList.add('carousel-item--clone');
  spacer.setAttribute('aria-hidden', 'true');
  rail.prepend(spacer.cloneNode());
  rail.append(spacer);

  const stepSize = () => {
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
    return firstItem.offsetWidth + gap;
  };

  const updateState = () => {
    previousButton.disabled = rail.scrollLeft <= 10;
    nextButton.disabled = Math.ceil(rail.scrollLeft + rail.clientWidth) >= rail.scrollWidth - stepSize() - 10;

    for (const item of rail.querySelectorAll<HTMLElement>('.carousel-item:not(.carousel-item--clone)')) {
      const {left, right} = item.getBoundingClientRect();
      const isVisible = left >= 0 && right <= window.innerWidth;
      item.classList.toggle('carousel-item--hidden', !isVisible);
      for (const link of item.querySelectorAll<HTMLAnchorElement>('a')) link.tabIndex = isVisible ? 0 : -1;
    }
  };

  const move = (direction: -1 | 1) => {
    rail.scrollBy({left: direction * stepSize(), behavior: 'smooth'});
  };

  previousButton.addEventListener('click', () => {
    move(-1);
  });
  nextButton.addEventListener('click', () => {
    move(1);
  });
  rail.addEventListener('scroll', updateState, {passive: true});
  window.addEventListener('resize', updateState);

  rail.scrollLeft = 0;
  root.dataset.carouselReady = 'true';
  updateState();
}
