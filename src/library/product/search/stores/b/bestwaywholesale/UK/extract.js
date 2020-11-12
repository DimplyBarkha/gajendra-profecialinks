const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    transform,
    domain: 'bestwaywholesale.co.uk',
  },
};
