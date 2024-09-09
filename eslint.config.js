module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        'process': 'readonly',
        'module': 'readonly',
        'exports': 'writable',
        'require': 'readonly',
        '__filename': 'readonly',
        '__dirname': 'readonly',
        // ES6+ globals
        'Promise': 'readonly',
        'Map': 'readonly',
        'Set': 'readonly',
        'Symbol': 'readonly',
      }
    },
    rules: {
      'no-unused-vars': ['warn'],
    },
  },
];