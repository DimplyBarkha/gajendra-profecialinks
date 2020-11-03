const { transform } = require('../FR/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.fr',
    zipcode: '',
  },
};
