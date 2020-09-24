const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    transform: transform,
    domain: 'shopping.google.com',
    zipcode: '',
  },
};
