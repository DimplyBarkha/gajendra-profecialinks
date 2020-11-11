const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    transform: cleanUp,
    domain: 'bestbuy.com',
    zipcode: '',
  },
};
