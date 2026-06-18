// eslint-disable-line unicorn/filename-case
import {createRoot} from 'react-dom/client';
import 'uno.css';
import React, {Suspense} from 'react';
import ButtonExternalLink from '../../../../../src/components/react/ButtonExternalLink.tsx';

const CiStatus = React.lazy(async () => import('../../../../../src/components/react/ci/CiStatus.tsx'));
const HardwareGrid = React.lazy(async () => import('../../../../../src/components/react/ci/HardwareGrid.tsx'));
const LogoWheel = React.lazy(async () => import('../../../../../src/components/react/LogoWheel.tsx'));
const Story = React.lazy(async () => import('../../../../../src/components/react/Story.tsx'));
const CookieBanner = React.lazy(async () => import('../../../../../src/components/react/CookieBanner.tsx'));

// Eagerly import the markdown content files so that they are processed by UnoCSS
const markdownFiles = import.meta.glob('../../../../../content/**/*.md', {query: '?raw', eager: true});
// Const htmlFiles = import.meta.glob('../../layouts/**/*.html', {eager: true})
const htmlFiles = import.meta.glob('../../../layouts/**/*.html', {query: '?raw', eager: true});

// RenderButtons();
observeAndAnimate();

try {
  for (const element of document.querySelectorAll('div[data-component="IconButton"]')) {
    if (element instanceof HTMLElement) {
      const href = element.dataset.href ?? '';
      const children = element.innerHTML;
      createRoot(element).render(<ButtonExternalLink href={href}>{children}</ButtonExternalLink>);
    }
  }
} catch (error) {
  console.error('Error rendering buttons:', error);
}

hydrateComponent('#ci-status', CiStatus);
hydrateComponent('#hardware-grid', HardwareGrid);
hydrateComponent('#logo-wheel', LogoWheel);
hydrateComponent(
  '#xen-story',
  Story,
  <div className="uno-absolute uno-top-0 uno-left-0 uno-w-full uno-h-full uno-bg-black uno-z-100" />,
  () => {
    // Very hacky, but it lets react-spring/parallax fill the entire viewport
    // and handle scrolling correctly.
    const main = document.querySelector('main');
    if (main?.style) {
      main.style.paddingTop = '0'; // Remove top padding from main element
    } else {
      console.warn('No main element found to adjust padding');
    }
  },
);
hydrateComponent('#cookie-banner', CookieBanner);

function hydrateComponent(
  id: string,
  Component: React.LazyExoticComponent<React.FC>,
  fallback?: React.ReactNode,
  onRender?: () => void,
) {
  const element = document.querySelector(id);
  if (element) {
    createRoot(element).render(
      <Suspense fallback={fallback ?? null}>
        <Component />
      </Suspense>,
    );
    if (onRender) {
      onRender();
    }
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
