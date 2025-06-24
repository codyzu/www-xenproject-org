// eslint-disable-line unicorn/filename-case
import {h, render} from 'preact';
import {Story} from './components/Story.tsx';

const element = document.querySelector('#xen-story');
if (element) {
  console.log('rendering', element);
  element.innerHTML = ''; // Clear the inner HTML to avoid duplicate content
  render(<Story />, element);

  // Very hacky, but it lets react-spring/parallax fill the entire viewport
  // and handle scrolling correctly.
  const main = document.querySelector('main');
  if (main?.style) {
    main.style.paddingTop = '0'; // Remove top padding from main element
  } else {
    console.warn('No main element found to adjust padding');
  }
} else {
  console.warn('No #xen-story element found');
}
