globalThis.document.addEventListener('DOMContentLoaded', () => {
  if ('IntersectionObserver' in globalThis) {
    const observer = new globalThis.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-100px 0px',
      },
    );

    for (const element of globalThis.document.querySelectorAll('[data-animate]')) {
      observer.observe(element);
    }
  } else {
    for (const element of globalThis.document.querySelectorAll('[data-animate]')) {
      element.classList.add('animate');
    }
  }
});
