const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'rakuten',
    transform,
    domain: 'rakuten.com',
    zipcode: '',
  },
};
