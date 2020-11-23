const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    transform: transform,
    domain: 'carrefour.it',
    zipcode: '',
  },
};
