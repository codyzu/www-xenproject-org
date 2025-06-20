// eslint-disable-line unicorn/filename-case
import {h, render} from 'preact';
import {Story} from './components/Story.tsx';

const element = document.querySelector('#xen-story');
if (element) {
  console.log('rendering', element);
  element.innerHTML = ''; // Clear the inner HTML to avoid duplicate content
  render(<Story />, element);
} else {
  console.warn('No #xen-story element found');
}
