const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'carrefour',
    transform,
    zipcode: '',
    domain: 'carrefour.com.br',
  },
};