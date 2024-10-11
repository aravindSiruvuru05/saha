module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows modern ECMAScript features
    sourceType: 'module', // Allows use of imports
  },
  extends: [
    'eslint:recommended', // Use the recommended rules from ESLint
    'plugin:@typescript-eslint/recommended', // Use the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'prettier/prettier': 'error', // Make Prettier errors show up as ESLint errors
  },
};
