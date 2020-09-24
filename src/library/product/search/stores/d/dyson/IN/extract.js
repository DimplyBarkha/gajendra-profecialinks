const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    transform,
    domain: 'dyson.in',
    zipcode: '',
  },
};
