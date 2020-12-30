const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    transform,
    domain: 'amazon.es',
    zipcode: '',
  },
};
