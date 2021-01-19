const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'SE',
    store: 'amazon',
    transform,
    domain: 'amazon.se',
    zipcode: '',
  },
};
