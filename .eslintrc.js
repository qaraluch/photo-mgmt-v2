module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module"
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    quotes: ["warn", "double"],
    semi: ["error", "always"]
  }
};
