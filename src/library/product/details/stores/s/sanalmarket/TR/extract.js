const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'sanalmarket',
    transform,
    domain: 'migros.com.tr',
    zipcode: '',
  },
};
