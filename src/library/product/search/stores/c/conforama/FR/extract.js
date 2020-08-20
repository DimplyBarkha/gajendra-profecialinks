const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    transform,
    domain: 'conforama.fr',
    zipcode: '',
  },
};
