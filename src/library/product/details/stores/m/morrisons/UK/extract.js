const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
};
