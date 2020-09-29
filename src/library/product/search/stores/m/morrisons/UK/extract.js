const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
};
