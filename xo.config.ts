import {type FlatXoConfig} from 'xo';

const xoConfig: FlatXoConfig = [
  // ReactPlugin.configs.flat['jsx-runtime'],
  {
    ignores: [
      'scripts/**/*.js',
      '!scripts/research/**/*.js',
      'tests',
      'themes/xen-project/assets/js/**/*.js',
      '!themes/xen-project/assets/js/vite/**/*.js',
      'stories',
    ],
  },
  {
    // Files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    // ignores: ['tests/**', 'scripts/**'],
    // ignores: ['scripts', 'tests'],
    space: true,
    prettier: true,
    react: true,
    // Extends: [],
    rules: {
      'react/react-in-jsx-scope': 0,
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'pascalCase',
        },
      ],
    },
  },
];

export default xoConfig;
