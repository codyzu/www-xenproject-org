// eslint-disable-line unicorn/filename-case
// The LF requested cookies on the members join page
// We encapsulate that logic here
import {h, render} from 'preact';
import CookieBanner from './components/CookieBanner.tsx';
import injectZoomInfo from './scripts/zoom-info.js';

const element = document.querySelector('#cookie-banner');
if (element) {
  element.innerHTML = ''; // Clear the inner HTML to avoid duplicate content
  render(<CookieBanner onAccept={injectZoomInfo} />, element);
} else {
  console.warn('No #cookie-banner element found');
}
