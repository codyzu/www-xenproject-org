// uno.config.js
import { defineConfig, presetWind3, presetIcons } from 'unocss'

export default defineConfig({
  
  presets: [presetWind3({prefix: 'uno-', }), presetIcons({
    extraProperties: {
      'display': 'inline-block',
      'vertical-align': 'middle',
    },
  }),],
  content: {
    pipeline: {
      include: [
        /\.(js|html|md)($|\?)/,
        './themes/xen-project/layouts/**/*.html',
      ]
    }
  },
  theme: {
    maxWidth: {
      // '8xl': `${1312 + 40 + 40}px`,
    },
    colors: {
      primary: '#101828',
      secondary: '#475467',
      brand: '#f3f9ec',
      action: '#0077cc',
      'action-text': '#0062a7',
      'action-hover': '#005FA3',
      'action-active': '#00477A'
    }
  },
  shortcuts: {
    'uno-section': `uno-section-base uno-px-3 md:uno-px-10 uno-max-w-[1392px]`,
    'uno-section-nested': `uno-section-base uno-max-w-[1312px]`, 
    'uno-section-base': 'uno-flex uno-flex-col uno-flex-1 uno-gap-6 uno-mx-auto uno-pb-10 uno-w-full',
  }
})
