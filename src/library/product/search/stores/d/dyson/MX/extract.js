const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'dyson',
    transform,
    domain: 'dyson.com.mx',
    zipcode: '',
  },
};
