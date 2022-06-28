module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  rules: {
    'no-console': 'off',
    'import/extensions': 'off',
    'quote-props': ['error', 'consistent'],
    'import/no-unresolved': 'off',
    'no-shadow': 'off',
    'prefer-default-export': 'off',
    'import/no-import-module-exports': 'off',
    'no-extra-boolean-cast': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
  },
  // project: './tsconfig.json',
  // tsconfigRootDir: __dirname,
  // sourceType: "module",
};
