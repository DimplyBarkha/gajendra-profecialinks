const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'dyson',
    transform,
    domain: 'dyson.co.il',
    zipcode: '',
  },
};
