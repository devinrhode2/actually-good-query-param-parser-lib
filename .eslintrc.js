/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  env: {
    es2022: true,
  },
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
    // Maybe people copy-paste code into their project:
    'import/prefer-default-export': [
      'off',
    ],
    'prettier/prettier': ['off'],
  },
}
