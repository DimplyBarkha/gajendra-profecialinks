const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
    zipcode: '',
  },
};