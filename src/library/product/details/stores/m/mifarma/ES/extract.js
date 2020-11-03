const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    transform: transform,
    domain: 'mifarma.es',
    zipcode: '',
  },
};
