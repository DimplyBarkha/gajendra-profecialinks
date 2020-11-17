const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform: cleanUp,
    domain: 'bestbuy.com',
    zipcode: '',
  },
};
