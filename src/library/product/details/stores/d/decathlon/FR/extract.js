const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'decathlon',
    transform: transform,
    domain: 'decathlon.fr',
    zipcode: '',
  },
};
