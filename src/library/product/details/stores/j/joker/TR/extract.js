const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'joker',
    transform: transform,
    domain: 'joker.com.tr',
    zipcode: '',
  },
};
