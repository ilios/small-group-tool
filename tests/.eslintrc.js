module.exports = {
  env: {
    embertest: true
  },
  rules: {
    'no-shadow': [2, {
      builtinGlobals: true,
      allow: ['wait']
    },],
  }
};
