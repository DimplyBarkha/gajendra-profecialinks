const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/seller/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    transform,
    domain: 'amazon.ca',
    zipcode: '',
  },
};
