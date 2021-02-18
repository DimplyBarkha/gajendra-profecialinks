const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'joker',
    transform: transform,
    domain: 'joker.com.tr',
    zipcode: '',
  },
};
