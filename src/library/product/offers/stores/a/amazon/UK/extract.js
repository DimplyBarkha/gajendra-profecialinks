const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    domain: 'amazon.co.uk',
    zipcode: '',
  },
};

