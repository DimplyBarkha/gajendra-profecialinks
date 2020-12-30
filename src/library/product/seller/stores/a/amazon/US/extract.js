const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/seller/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
};
