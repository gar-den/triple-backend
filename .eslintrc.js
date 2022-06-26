module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  project: 'tsconfig.json',
  tsconfigRootDir: __dirname,
  sourceType: "module",
};
