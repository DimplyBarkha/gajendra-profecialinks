const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform,
    domain: 'amazon.it',
    zipcode: '',
  },
};