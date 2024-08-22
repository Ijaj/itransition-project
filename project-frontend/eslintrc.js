module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'standard',
      'plugin:react/recommended'
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 12,
      sourceType: 'module'
    },
    plugins: [
      'react'
    ],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }