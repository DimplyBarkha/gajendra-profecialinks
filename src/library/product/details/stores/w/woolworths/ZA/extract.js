const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'woolworths',
    transform,
    domain: 'woolworths.co.za',
    zipcode: '',
  },
};
