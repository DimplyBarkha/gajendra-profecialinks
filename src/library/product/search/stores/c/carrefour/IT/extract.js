const { transform } = require('../IT/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    transform,
    domain: 'carrefour.it',
    zipcode: '',
  },
};
