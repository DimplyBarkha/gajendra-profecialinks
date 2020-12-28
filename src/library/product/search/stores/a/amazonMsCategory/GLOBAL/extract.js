const { transform } = require('../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GLOBAL',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
};