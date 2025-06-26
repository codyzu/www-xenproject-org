// eslint-disable-line unicorn/filename-case
import {h, render} from 'preact';
import LogoWheel from './components/LogoWheel.tsx';

const element = document.querySelector('#logo-wheel');
if (element) {
  element.innerHTML = ''; // Clear the inner HTML to avoid duplicate content
  render(<LogoWheel />, element);
} else {
  console.warn('No #logo-wheel element found');
}
