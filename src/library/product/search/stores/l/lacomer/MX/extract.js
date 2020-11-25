const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    transform: transform,
    domain: 'lacomer.com.mx',
    zipcode: '',
  },
};
