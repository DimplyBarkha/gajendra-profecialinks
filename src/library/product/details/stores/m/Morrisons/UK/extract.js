const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform: cleanUp,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
};
