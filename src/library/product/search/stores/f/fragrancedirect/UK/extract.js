const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'fragrancedirect',
    transform: transform,
    domain: 'fragrancedirect.co.uk',
    zipcode: '',
  },
};
