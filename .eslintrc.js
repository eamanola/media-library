module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'react/require-default-props': ['off'],
    // 'sort-keys': ['error'],
    // 'require-unicode-regexp': ['error'],
    // 'prefer-named-capture-group': ['error'],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    // 'no-throw-literal': ['off'],
  },
};
