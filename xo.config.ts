import {type FlatXoConfig} from 'xo';

const xoConfig: FlatXoConfig = [
  {
    ignores: ['scripts/**/*.js', 'tests'],
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
