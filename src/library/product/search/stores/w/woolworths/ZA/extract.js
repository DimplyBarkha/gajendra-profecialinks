const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ZA',
    store: 'woolworths',
    transform,
    domain: 'woolworths.co.za',
    zipcode: '',
  },
};
