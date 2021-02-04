const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'jiomart',
    transform,
    domain: 'jiomart.com',
    zipcode: '560012',
  },
};
