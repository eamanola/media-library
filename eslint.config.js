// import airbnb from 'eslint-config-xaxa/airbnb';
import airbnb from 'eslint-stylistic-airbnb';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs as importX } from 'eslint-plugin-import-x';
import globals from 'globals';

export default [
  {
    ignores: ['build/*', 'public/*'],
  },
  importX['flat/recommended'],
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,

  // airbnb
  airbnb.configs['flat/strict'],
  // requires import-x
  airbnb.configs['flat/addon-import'],
  // requires eslint-plugin-react
  // recommended eslint-plugin-react-hooks
  airbnb.configs['flat/addon-react'],
  airbnb.configs['flat/addon-jsx'],
  {
    // eslint-stylistic-airbnb deprecated overrides
    rules: {
      '@stylistic/line-comment-position': [
        'error',
        {
          applyDefaultIgnorePatterns: true,
          ignorePattern: '',
          position: 'above',
        },
      ],
      // known by maintainer
      // '@stylistic/jsx-indent': ['error', 2],
    },
  },
  {
    // react
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
      'react/require-default-props': ['off'],
    },
  },
  {
    rules: {
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      'no-console': [
        'warn',
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
  {
    files: ['**/*.test.js', 'jest/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.cjs'],
    rules: {
      'import/no-commonjs': ['off'],
    },
  },
  // project specific
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
          ],
        },
      ],
    },
  },
];
