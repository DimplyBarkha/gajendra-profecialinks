const {transform} = require('../format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com.mx',
    zipcode: '',
  },
};
