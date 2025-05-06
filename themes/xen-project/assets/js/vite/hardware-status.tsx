import { h, render } from 'preact';
import { HardwareGrid } from './components/HardwareGrid';

const el = document.getElementById('hardware-grid');
if (el) {
  el.innerHTML = ''; // Clear the inner HTML to avoid duplicate content
  render(<HardwareGrid />, el);
} else {
  console.warn('No #hardware-grid element found');
}