const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'NL',
    store: 'amazon',
    transform,
    domain: 'amazon.nl',
    zipcode: '',
  },
};
