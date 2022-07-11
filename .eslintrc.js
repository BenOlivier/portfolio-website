module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    'indent': 'off',
    'brace-style': ['error', 'allman'],
    'require-jsdoc': 'off',
    'max-len': ['error', {'code': 100}],
  },
};
