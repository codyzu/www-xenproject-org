import {type FlatXoConfig} from 'xo';

const xoConfig: FlatXoConfig = [
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
    space: true,
    prettier: true,
    react: true,
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
