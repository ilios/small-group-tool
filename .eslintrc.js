module.exports = {
  globals: {
    server: true,
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    "comma-dangle": [2, "only-multiline"],
    "radix": [2, "always"],
    /* Stylistic Issues http://eslint.org/docs/rules/#stylistic-issues */
    indent: [2, 2], /* two-space indentation */
    semi: 2, /* require semi-colons */
    camelcase: 2, /* require camelCase variables */
    'no-shadow': [2, {
      builtinGlobals: true,
    }],
    'ember/order-in-components': 2,
    'ember/order-in-controllers': 2,
    'ember/order-in-models': 2,
    'ember/order-in-routes': 2,
  }
};
