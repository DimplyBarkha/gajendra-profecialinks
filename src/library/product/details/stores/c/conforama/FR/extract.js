
const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    transform,
    domain: 'conforama.fr',
    zipcode: '',
  },
};
