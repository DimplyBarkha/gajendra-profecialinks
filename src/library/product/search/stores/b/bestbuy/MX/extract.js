const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com.mx',
    zipcode: '',
  },
};
