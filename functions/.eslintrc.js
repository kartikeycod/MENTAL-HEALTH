// .eslintrc.js

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // This enables Node.js global variables like require and exports
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    quotes: ["error", "double"],
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};