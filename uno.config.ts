// Uno.config.js
import {defineConfig, presetWind3, presetIcons, transformerVariantGroup, type Rule} from 'unocss';
import {clsx} from 'clsx';

export default defineConfig({
  presets: [
    presetWind3({prefix: 'uno-'}),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerVariantGroup()],
  content: {
    pipeline: {
      include: [/\.(js|jsx|ts|tsx|html|md)($|\?)/, './themes/xen-project/layouts/**/*.html'],
    },
  },
  theme: {
    maxWidth: {
      // '8xl': `${1312 + 40 + 40}px`,
    },
    colors: {
      primary: '#101828',
      secondary: '#475467',
      border: '#dbdbdb',
      surface: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DEFAULT: '#fbfbfb',
        secondary: '#ededed',
      },
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DEFAULT: '#0077cc',
        text: '#0062a7',
        hover: '#005FA3',
        active: '#00477A',
        surface: '#bcdef7',
      },
      brand: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DEFAULT: '#f3f9ec',
        fill: '#85c241',
        'on-fill': '#1e2b0e',
        text: '#567c2a',
      },
    },
    animation: {
      keyframes: {
        'fade-in-left-short': `{
          from { opacity:0;transform:translate3d(-150px,0,0) }
          to { opacity:1;transform:translate3d(0,0,0) }
        }`,
        'fade-in-right-short': `{
          from { opacity:0;transform:translate3d(150px,0,0) }
          to { opacity:1;transform:translate3d(0,0,0) }
        }`,
        orbit: `{
          0% { transform:rotate(0deg) }
          100% { transform:rotate(360deg) }
        }`,
        grain: `{
          0%, 100% { transform:translate(0, 0) }
          10% { transform:translate(-5%, -10%) }
          20% { transform:translate(-15%, 5%) }
          30% { transform:translate(7%, -25%) }
          40% { transform:translate(-5%, 25%) }
          50% { transform:translate(-15%, 10%) }
          60% { transform:translate(15%, 0%) }
          70% { transform:translate(0%, 15%) }
          80% { transform:translate(3%, 35%) }
          90% { transform:translate(-10%, 10%) }
        }`,
      },
      durations: {
        'fade-in-left-short': '0.8s',
        'fade-in-right-short': '0.8s',
        grain: '1s',
        orbit: `${360 / 25}s`,
      },
      timingFns: {
        'fade-in-left-short': 'ease-out',
        'fade-in-right-short': 'ease-out',
        grain: 'steps(10)',
      },
      counts: {
        grain: 'infinite',
        orbit: 'infinite',
      },
    },
    boxShadow: {
      'fade-in': 'inset 0 0 12px 12px var(--un-shadow-color)',
      glow: 'var(--un-shadow-inset) 0 0 14px 3px rgb(0 0 0 / 0.05)',
      'glow-lg': 'var(--un-shadow-inset) 0 0 14px 4px rgb(0 0 0 / 0.05)',
      'glow-xl': 'var(--un-shadow-inset) 0 0 14px 5px rgb(0 0 0 / 0.05)',
    },
  },
  shortcuts: {
    'uno-section': `uno-section-base uno-px-3 md:uno-px-10 uno-max-w-[1392px]`,
    'uno-section-nested': `uno-section-base uno-max-w-[1312px]`,
    'uno-section-base': 'uno-flex uno-flex-col uno-flex-1 uno-gap-6 uno-mx-auto uno-pb-10 uno-w-full',
    'uno-surface-brand':
      'uno-flex uno-flex-col uno-items-center uno-text-base uno-text-primary uno-bg-brand uno-rounded-3xl uno-p-10',
    'uno-card': clsx(
      'uno-px-6 uno-py-4 uno-rounded-lg',
      'uno-border-0 uno-border-t-12 uno-border-brand-fill uno-border-solid',
      'uno-shadow-xl uno-bg-white uno-text-primary',
    ),
    'uno-card-side': clsx(
      'uno-px-6 uno-py-4 uno-rounded-lg',
      'uno-border-0 uno-border-l-12 uno-border-brand-fill uno-border-solid',
      'uno-shadow-xl uno-bg-white uno-text-primary',
    ),
    'uno-surface': 'uno-bg-surface uno-p-x-6 uno-p-y-8 uno-rounded-lg uno-shadow-lg',
    'uno-orbit-0':
      'uno-translate-y--80% sm:uno-translate-y--250% children:(uno-animate-orbit uno-orbit-offset-0 uno-transform-origin-[center_130%]) children:sm:(uno-transform-origin-[center_300%])',
    'uno-orbit-1':
      'uno-translate-y--150% children:(uno-animate-orbit uno-orbit-offset-1 uno-transform-origin-[center_200%])',
    'uno-orbit-2':
      'uno-translate-y--80% sm:uno-translate-y--250% children:(uno-animate-orbit uno-orbit-offset-2 uno-transform-origin-[center_130%]) children:sm:(uno-transform-origin-[center_300%])',
    'uno-orbit-3':
      'uno-translate-y--150% children:(uno-animate-orbit uno-orbit-offset-3 uno-transform-origin-[center_200%])',
  },
  rules: [
    [
      'uno-xen-shadow',
      {
        'text-shadow':
          '1px 1px 2px black, 0 0 1em rgb(133, 194, 65), 0 0 0.4em rgb(133, 194, 65), 0 0 0.2em rgb(133, 194, 65)',
      },
    ],
    [
      'uno-align-xen',
      {
        'vertical-align': '0.14em',
      },
    ],
    ...Array.from(
      {length: 4},
      (_, i) =>
        [
          `uno-orbit-offset-${i}`,
          {'animation-delay': `${(360 / 25) * (i * 0.25)}s`, 'animation-duration': `${(360 / 25) * (1 + i * 0.05)}s`},
        ] as Rule,
    ),
  ],
  // Animation durations for stars on the homepage
  safelist: Array.from({length: 10}, (_, i) => `uno-animate-duration-${(i + 7) * 200}`),
});
