// import airbnb from 'eslint-config-xaxa/airbnb';
import airbnb from 'eslint-stylistic-airbnb';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs as importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import js from '@eslint/js';

const SHOW_WARNINGS = 'off';
export default [
  // artifacts
  {
    ignores: ['public/*', 'dist/*'],
  },
  js.configs.recommended,
  importX['flat/recommended'],
  importX['flat/react'],
  react.configs.flat.all,
  // with React 17+
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],

  // airbnb
  airbnb.configs['flat/strict'],
  // requires import-x
  airbnb.configs['flat/addon-import'],
  // requires eslint-plugin-react
  // recommended eslint-plugin-react-hooks
  airbnb.configs['flat/addon-react'],
  airbnb.configs['flat/addon-jsx'],
  // eslint-stylistic-airbnb deprecated overrides
  {
    rules: {
      // known by maintainer
      // '@stylistic/jsx-indent': ['error', 2],
      '@stylistic/line-comment-position': [
        'error',
        {
          applyDefaultIgnorePatterns: true,
          ignorePattern: '',
          position: 'above',
        },
      ],
    },
  },
  // react
  {
    files: ['**/*.jsx', '**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules
      'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-max-props-per-line': [
        'error',
        {
          maximum: { multi: 1, single: 3 },
          // maximum: 1
          // only work, if maximum is number
          // when: 'multiline',
        },
      ],
      'react/jsx-no-literals': ['off'],
    },
  },
  // general
  {
    rules: {
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      'no-console': [
        SHOW_WARNINGS,
        {
          allow: [
            'info',
            'warn',
            'error',
          ],
        },
      ],
      'prefer-named-capture-group': ['error'],
      'require-unicode-regexp': ['error'],
      'sort-keys': ['warn'],
    },
  },
  // test
  {
    files: ['**/*.test.js', 'jest/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  // commonjs
  {
    files: ['**/*.cjs'],
    rules: {
      'import/no-commonjs': ['off'],
    },
  },
  // dev files
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'eslint.config.js',
            'webpack.config.cjs',
            '**/*.test.js',
            'vite.config.js',
          ],
        },
      ],
    },
  },
];
