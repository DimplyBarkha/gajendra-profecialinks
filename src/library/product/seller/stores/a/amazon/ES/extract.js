const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/seller/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    transform,
    domain: 'amazon.es',
    zipcode: '',
  },
};
