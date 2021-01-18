const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    transform,
    domain: 'myntra.com',
    zipcode: '',
  },
};
