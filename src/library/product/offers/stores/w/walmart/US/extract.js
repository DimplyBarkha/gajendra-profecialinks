const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform,
    domain: 'walmart.com',
    zipcode: '',
  },
};
