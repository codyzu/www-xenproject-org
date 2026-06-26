// Uno.config.js
import {defineConfig, presetWind3, presetIcons, presetWebFonts, transformerVariantGroup, type Rule} from 'unocss';
import {clsx} from 'clsx';

export default defineConfig({
  presets: [
    // Keep Wind 3 semantics for now. Migrated pages and React islands depend
    // on Tailwind 3-style UnoCSS behavior and the `uno-` prefix.
    presetWind3({prefix: 'uno-'}),
    // Redesign font utilities. BaseLayout loads the Google Fonts stylesheet
    // for new pages; this preset maps `uno-font-sans` and `uno-font-mono`.
    presetWebFonts({
      provider: 'google',
      inlineImports: false,
      fonts: {
        sans: {
          name: 'Inter',
          weights: [400, 500, 600, 700, 800],
        },
        mono: {
          name: 'JetBrains Mono',
          weights: [400, 500, 600],
        },
      },
    }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerVariantGroup()],
  content: {
    // Astro's client-only React chunks are not guaranteed to pass every class
    // through UnoCSS's transform pipeline. Scan source files explicitly so
    // responsive variants used by islands are present in production CSS.
    filesystem: ['./src/**/*.{astro,md,mdx,js,jsx,ts,tsx}'],
    pipeline: {
      include: [/\.(astro|js|jsx|ts|tsx|html|md|mdx)($|\?)/],
    },
  },
  theme: {
    maxWidth: {
      // Redesign container accessors. Values live in CSS variables so
      // `tokens.css` remains the source of truth.
      'xp-content': 'var(--xp-container-content)',
      'xp-page': 'var(--xp-container-page)',
      'xp-wide': 'var(--xp-container-wide)',
    },
    colors: {
      // Legacy-compatible aliases used by migrated pages and existing islands.
      // Keep these stable unless every consumer has moved to `xp.*` tokens.
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
        onfill: '#1e2b0e',
        text: '#567c2a',
      },
      // New redesign token namespace. CSS variables in
      // `src/styles/foundation/tokens.css` are the source of values; these
      // entries are ergonomic accessors for utilities like
      // `uno-bg-xp-surface-1` and `uno-text-xp-text-primary`.
      xp: {
        ink: 'var(--xp-color-ink)',
        muted: 'var(--xp-color-ink-muted)',
        subtle: 'var(--xp-color-ink-subtle)',
        canvas: 'var(--xp-color-canvas)',
        text: {
          primary: 'var(--xp-text-primary)',
          secondary: 'var(--xp-text-secondary)',
          muted: 'var(--xp-text-muted)',
          'on-light': 'var(--xp-text-on-light)',
          'on-light-muted': 'var(--xp-text-on-light-muted)',
        },
        surface: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          DEFAULT: 'var(--xp-color-surface)',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          0: 'var(--xp-surface-0)',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          1: 'var(--xp-surface-1)',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          2: 'var(--xp-surface-2)',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          3: 'var(--xp-surface-3)',
          light: 'var(--xp-surface-light)',
          'light-raised': 'var(--xp-surface-light-raised)',
          subtle: 'var(--xp-color-surface-subtle)',
        },
        raised: 'var(--xp-color-surface-raised)',
        dark: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          DEFAULT: 'var(--xp-color-surface-dark)',
          raised: 'var(--xp-color-surface-dark-raised)',
        },
        border: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          DEFAULT: 'var(--xp-color-border)',
          muted: 'var(--xp-border-muted)',
          strong: 'var(--xp-color-border-strong)',
        },
        accent: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          DEFAULT: 'var(--xp-color-accent)',
          primary: 'var(--xp-accent-primary)',
          secondary: 'var(--xp-accent-secondary)',
          strong: 'var(--xp-color-accent-strong)',
          soft: 'var(--xp-color-accent-soft)',
          'primary-strong': 'var(--xp-accent-primary-strong)',
          'primary-active': 'var(--xp-accent-primary-active)',
          'primary-soft': 'var(--xp-accent-primary-soft)',
          'primary-text': 'var(--xp-accent-primary-text)',
          'secondary-soft': 'var(--xp-accent-secondary-soft)',
        },
        green: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          DEFAULT: 'var(--xp-color-green)',
          soft: 'var(--xp-color-green-soft)',
        },
        warning: 'var(--xp-color-warning)',
        danger: 'var(--xp-color-danger)',
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
      // Existing homepage/legacy shadow names.
      'fade-in': 'inset 0 0 12px 12px var(--un-shadow-color)',
      glow: 'var(--un-shadow-inset) 0 0 14px 3px rgb(0 0 0 / 0.05)',
      'glow-lg': 'var(--un-shadow-inset) 0 0 14px 4px rgb(0 0 0 / 0.05)',
      'glow-xl': 'var(--un-shadow-inset) 0 0 14px 5px rgb(0 0 0 / 0.05)',
      // Redesign elevation accessors backed by CSS variables.
      'xp-sm': 'var(--xp-shadow-sm)',
      'xp-md': 'var(--xp-shadow-md)',
      'xp-lg': 'var(--xp-shadow-lg)',
    },
    borderRadius: {
      // Redesign radius accessors backed by CSS variables.
      'xp-sm': 'var(--xp-radius-sm)',
      'xp-md': 'var(--xp-radius-md)',
      'xp-lg': 'var(--xp-radius-lg)',
    },
  },
  shortcuts: {
    // Legacy compatibility shortcuts. These keep migrated pages and current
    // islands stable; avoid adding new `uno-*` shortcuts unless they are
    // compatibility helpers.
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

    // Redesign shortcuts. Use `xen-*` only for repeated visual recipes that
    // support components. Astro components still own structure, semantics,
    // slots, variants, and composition.
    'xen-panel': 'uno-rounded-xp-lg uno-border uno-border-xp-border-muted uno-bg-xp-surface-1 uno-p-6 uno-shadow-xp-sm',
    'xen-panel-elevated':
      'uno-rounded-xp-lg uno-border uno-border-xp-border-muted uno-bg-xp-surface-2 uno-p-6 uno-shadow-xp-md',
    'xen-card': 'uno-rounded-xp-md uno-border uno-border-xp-border-muted uno-bg-xp-surface-2 uno-p-5 uno-shadow-xp-sm',
    'xen-layered-popover':
      'xen-layered-backdrop uno-rounded-xp-lg uno-border uno-border-solid uno-border-[var(--xp-border-layered-popover)] uno-bg-[var(--xp-surface-layered-popover)] uno-shadow-[var(--xp-shadow-layered-popover)]',
    'xen-popover-intro':
      'uno-flex uno-min-w-0 uno-flex-col uno-gap-5 lg:uno-border-0 lg:uno-border-r lg:uno-border-solid lg:uno-border-xp-border-muted lg:uno-pr-6',
    'xen-popover-title':
      'xen-focus uno-rounded-xp-md uno-text-lg uno-font-bold uno-text-xp-text-primary uno-no-underline hover:uno-text-xp-text-primary hover:uno-underline hover:uno-decoration-[var(--xp-accent-primary)] hover:uno-underline-offset-4',
    'xen-popover-description': 'uno-m-0 uno-text-sm uno-leading-6 uno-text-xp-text-secondary',
    'xen-popover-cta': 'uno-flex uno-pt-1',
    'xen-popover-cta-button': 'uno-w-fit uno-min-w-0 uno-px-4',
    'xen-popover-heading':
      'uno-m-0 uno-flex uno-items-center uno-gap-2 uno-pb-2 uno-text-xs uno-font-bold uno-uppercase uno-tracking-[0.08em] uno-text-[var(--xp-accent-primary-strong)]',
    'xen-popover-heading-icon': 'uno-h-4 uno-w-4 uno-shrink-0 uno-opacity-55',
    'xen-popover-link':
      'xen-focus uno-flex uno-rounded-xp-md uno-border-0 uno-border-b uno-border-solid uno-border-transparent uno-px-3 uno-py-2 uno-text-sm uno-font-semibold uno-text-xp-text-secondary uno-no-underline uno-transition-colors hover:uno-border-[var(--xp-accent-primary)] hover:uno-bg-xp-surface-2 hover:uno-text-xp-text-primary active:uno-border-[var(--xp-accent-primary-active)] active:uno-text-xp-text-primary',
    'xen-mobile-nav-panel':
      'uno-fixed uno-inset-auto uno-left-auto uno-bottom-auto uno-right-4 uno-top-[4.375rem] uno-m-0 uno-max-h-[calc(100dvh-5.25rem)] uno-w-[min(24rem,calc(100vw-2rem))] uno-overflow-y-auto uno-overscroll-contain uno-p-3',
    'xen-mobile-nav-summary':
      'xen-focus uno-flex uno-cursor-pointer uno-list-none uno-items-center uno-justify-between uno-gap-3 uno-rounded-xp-md uno-px-3 uno-py-3 uno-font-semibold uno-text-xp-text-primary hover:uno-bg-xp-surface-2',
    'xen-mobile-nav-content': 'uno-flex uno-flex-col uno-gap-4 uno-px-3 uno-pb-4 uno-pt-1',
    'xen-mobile-nav-description': 'uno-m-0 uno-text-sm uno-leading-6 uno-text-xp-text-secondary',
    'xen-mobile-nav-overview':
      'xen-focus uno-flex uno-rounded-xp-md uno-border uno-border-solid uno-border-xp-border-muted uno-bg-xp-surface-2 uno-px-3 uno-py-2 uno-text-sm uno-font-semibold uno-text-xp-text-primary uno-no-underline hover:uno-border-[var(--xp-accent-primary)] hover:uno-bg-xp-surface-3',
    'xen-mobile-nav-heading':
      'uno-m-0 uno-pb-1 uno-text-xs uno-font-bold uno-uppercase uno-tracking-[0.08em] uno-text-[var(--xp-accent-primary-strong)]',
    'xen-mobile-nav-link':
      'xen-focus uno-flex uno-rounded-xp-md uno-py-2 uno-text-sm uno-font-medium uno-text-xp-text-secondary uno-no-underline hover:uno-text-xp-text-primary',
    'xen-mobile-nav-cta': 'uno-border-0 uno-border-t uno-border-solid uno-border-xp-border-muted uno-pt-4',
    'xen-mobile-nav-cta-button': 'uno-w-full uno-min-w-0',
    'xen-focus':
      'uno-outline-none focus-visible:uno-outline focus-visible:uno-outline-3 focus-visible:uno-outline-offset-3 focus-visible:uno-outline-[var(--xp-focus-ring)] focus-visible:uno-shadow-[0_0_0_6px_var(--xp-accent-primary-soft)]',
    'xen-action':
      'xen-focus uno-inline-flex uno-min-h-11 uno-min-w-36 uno-items-center uno-justify-center uno-rounded-xp-md uno-px-5 uno-font-bold uno-leading-none uno-no-underline uno-shadow-xp-sm uno-transition-colors',
    'xen-action-primary':
      'xen-action uno-bg-xp-accent-primary uno-text-[var(--xp-accent-primary-text)] hover:uno-bg-[var(--xp-accent-primary-strong)] active:uno-bg-[var(--xp-accent-primary-active)]',
    'xen-action-secondary':
      'xen-action uno-border uno-border-xp-border-strong uno-bg-xp-surface-2 uno-text-xp-text-primary hover:uno-bg-xp-surface-3',
    'xen-action-text':
      'xen-focus uno-inline-flex uno-min-h-11 uno-items-center uno-rounded-xp-md uno-px-2 uno-font-bold uno-leading-none uno-text-xp-text-primary uno-underline uno-decoration-xp-accent-primary uno-decoration-2 uno-underline-offset-6 uno-transition-colors hover:xen-action-text-hover hover:uno-text-xp-text-primary active:xen-action-text-active',

    // Homepage story compatibility shortcuts.
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
    [
      'xen-action-text-hover',
      {
        'background-color': 'var(--xp-accent-primary-soft)',
      },
    ],
    [
      'xen-action-text-active',
      {
        'background-color': 'var(--xp-accent-primary-soft)',
      },
    ],
    [
      'xen-layered-backdrop',
      {
        '-webkit-backdrop-filter': 'var(--xp-backdrop-layered-popover)',
        'backdrop-filter': 'var(--xp-backdrop-layered-popover)',
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
