// eslint-disable-line unicorn/filename-case
import {h, render} from 'preact';
import {HardwareGrid} from './components/HardwareGrid/HardwareGrid.tsx';

const element = document.querySelector('#hardware-grid');
if (element) {
  element.innerHTML = ''; // Clear the inner HTML to avoid duplicate content
  render(<HardwareGrid />, element);
} else {
  console.warn('No #hardware-grid element found');
}
