/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'xo',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of import
    project: './tsconfig.eslint.json', // Allows for the use of rules which require parserServices to be generated
  },
  rules: {
    'prettier/prettier': ['off'],
  },
}
