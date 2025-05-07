if(import.meta.env.MODE !== 'production') {
  // @ts-expect-error no types for preact/debug
  import('preact/debug').then(() => {
    console.log('Preact debug mode enabled');
  })
}

import { h, render } from 'preact';
import IconButton from './components/IconButton';
import 'uno.css';

// Eagerly import the markdown content files so that they are processed by UnoCSS
const markdownFiles = import.meta.glob('../../../../../content/**/*.md', {query: '?raw', eager: true})
// const htmlFiles = import.meta.glob('../../layouts/**/*.html', {eager: true})
const htmlFiles = import.meta.glob('../../../layouts/**/*.html', {query: '?raw', eager: true})

renderButtons();
observeAndAnimate();

function renderButtons() {
  try{
    document.querySelectorAll('div[data-component="IconButton"]').forEach((el) => {
      const href = el.getAttribute('data-href') || '';
      const target = el.getAttribute('data-target') || '_blank';
      const children = el.innerHTML;
      el.innerHTML = ''; // Clear the inner HTML to avoid duplicate content

      render(<IconButton href={href} target={target}>{children}</IconButton>, el);
    });
  } catch (error) {
    console.error('Error rendering buttons:', error);
  }
}

function observeAndAnimate() {
  try {
    const elements = document.querySelectorAll('[data-uno-animate]');
    elements.forEach((element) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            observer.unobserve(entry.target);
            const animationClass = element.getAttribute('data-uno-animate');
            if (!animationClass) {
              return;
            }

            element.classList.add(animationClass);
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(element);
    });
  } catch (error) {
    console.error('Error observing elements:', error);
  }
}
