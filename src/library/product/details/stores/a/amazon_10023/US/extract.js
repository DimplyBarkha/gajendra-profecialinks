const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon_10023',
    transform,
    domain: 'amazon.com',
    zipcode: '10023',
  },
};
