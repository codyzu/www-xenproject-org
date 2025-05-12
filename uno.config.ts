// Uno.config.js
import {defineConfig, presetWind3, presetIcons} from 'unocss';
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
      },
      durations: {
        'fade-in-left-short': '0.8s',
        'fade-in-right-short': '0.8s',
      },
      timingFns: {
        'fade-in-left-short': 'ease-out',
        'fade-in-right-short': 'ease-out',
      },
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
      'uno-shadow-xl uno-shadow-gray-300 uno-bg-white uno-text-primary',
    ),
  },
});
