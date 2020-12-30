const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/seller/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    domain: 'amazon.fr',
    zipcode: '',
  },
};
