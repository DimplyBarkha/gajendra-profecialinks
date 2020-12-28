const { transform } = require('../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
};