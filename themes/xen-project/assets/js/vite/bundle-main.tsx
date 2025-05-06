import { h, render } from 'preact';
import IconButton from './components/IconButton';
import 'uno.css';

// Eagerly import the markdown content files so that they are processed by UnoCSS
const markdownFiles = import.meta.glob('../../../../../content/**/*.md', {query: '?raw', eager: true})
// const htmlFiles = import.meta.glob('../../layouts/**/*.html', {eager: true})
const htmlFiles = import.meta.glob('../../../layouts/**/*.html', {query: '?raw', eager: true})

// Find all divs rendered by the icon-button shortcode and hydrate them
document.querySelectorAll('div[data-component="IconButton"]').forEach((el) => {
  const href = el.getAttribute('data-href') || '';
  const target = el.getAttribute('data-target') || '_blank';
  const children = el.innerHTML;
  el.innerHTML = ''; // Clear the inner HTML to avoid duplicate content

  render(<IconButton href={href} target={target}>{children}</IconButton>, el);
});
