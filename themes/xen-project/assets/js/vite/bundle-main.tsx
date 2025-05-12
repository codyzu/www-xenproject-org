// eslint-disable-line unicorn/filename-case
import {h, render} from 'preact';
import 'uno.css';
import ButtonExternalLink from './components/ButtonExternalLink.tsx';

if (import.meta.env.MODE !== 'production') {
  // eslint-disable-next-line unicorn/prefer-top-level-await, promise/prefer-await-to-then
  void import('preact/debug').then(() => {
    console.log('Preact debug mode enabled');
  });
}

// Eagerly import the markdown content files so that they are processed by UnoCSS
const markdownFiles = import.meta.glob('../../../../../content/**/*.md', {query: '?raw', eager: true});
// Const htmlFiles = import.meta.glob('../../layouts/**/*.html', {eager: true})
const htmlFiles = import.meta.glob('../../../layouts/**/*.html', {query: '?raw', eager: true});

renderButtons();
observeAndAnimate();

function renderButtons() {
  try {
    for (const element of document.querySelectorAll('div[data-component="IconButton"]')) {
      if (element instanceof HTMLElement) {
        const href = element.dataset.href ?? '';
        const children = element.innerHTML;
        element.innerHTML = ''; // Clear the inner HTML to avoid duplicate content

        render(<ButtonExternalLink href={href}>{children}</ButtonExternalLink>, element);
      }
    }
  } catch (error) {
    console.error('Error rendering buttons:', error);
  }
}

function observeAndAnimate() {
  try {
    const elements = document.querySelectorAll('[data-uno-animate]');
    for (const element of elements) {
      if (element instanceof HTMLElement) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) {
                continue;
              }

              observer.unobserve(entry.target);
              const animationClass = element.dataset.unoAnimate;
              if (!animationClass) {
                continue;
              }

              element.classList.add(animationClass);
            }
          },
          {threshold: 0.1},
        );
        observer.observe(element);
      }
    }
  } catch (error) {
    console.error('Error observing elements:', error);
  }
}
