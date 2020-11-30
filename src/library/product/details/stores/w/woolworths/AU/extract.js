const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    transform,
    domain: 'woolworths.com.au',
    zipcode: '',
  },
};
