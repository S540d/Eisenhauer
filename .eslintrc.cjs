module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // ===========================================================================
    // Code Quality Rules
    // ===========================================================================

    // Strict equality
    eqeqeq: ['error', 'always'],

    // No var, use const/let
    'no-var': 'error',
    'prefer-const': ['warn', { destructuring: 'all' }],

    // Console logging
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info', 'debug'],
      },
    ],

    // No unused variables
    'no-unused-vars': 'off',

    // ===========================================================================
    // TypeScript Specific Rules
    // ===========================================================================

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // ===========================================================================
    // Best Practices
    // ===========================================================================

    // Prevent unsafe comparisons
    'no-fallthrough': 'warn',

    // Disallow sparse arrays
    'no-sparse-arrays': 'error',

    // No unreachable code
    'no-unreachable': 'error',

    // No with statements
    'no-with': 'error',

    // ===========================================================================
    // Code Style (works with Prettier)
    // ===========================================================================

    semi: 'off', // Prettier handles this
    quotes: 'off', // Prettier handles this
    indent: 'off', // Prettier handles this
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      // Looser rules for test files
      files: ['*.test.js', '*.test.ts', '**/__tests__/**'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
