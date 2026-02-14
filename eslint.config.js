import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      'node_modules/',
      'dist/',
      'Android/',
      'tests/',
      'script.legacy.js',
      'auth.js',
      'firebase-config.js',
      'firebase-config.example.js',
      '.archive/',
      '.templates/',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsparser,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
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

      // No unused variables — use TypeScript version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ===========================================================================
      // Best Practices
      // ===========================================================================

      'no-fallthrough': 'warn',
      'no-sparse-arrays': 'error',
      'no-unreachable': 'error',
      'no-with': 'error',

      // ===========================================================================
      // Code Style (works with Prettier)
      // ===========================================================================

      semi: 'off',
      quotes: 'off',
      indent: 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['**/*.test.js', '**/*.test.ts', '**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
