// eslint-disable-line unicorn/filename-case
import {h, render} from 'preact';
import CiStatus from './components/ci/CiStatus.tsx';

const element = document.querySelector('#ci-status');
if (element) {
  element.innerHTML = ''; // Clear the inner HTML to avoid duplicate content
  render(<CiStatus />, element);
} else {
  console.warn('No #ci-status element found');
}
