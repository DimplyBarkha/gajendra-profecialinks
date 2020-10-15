const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    transform,
    domain: 'sportsdirect.com',
    zipcode: '',
  },
};
