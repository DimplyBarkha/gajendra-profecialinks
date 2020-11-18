const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'tiendanimal',
    transform,
    domain: 'tiendanimal.es',
    zipcode: '',
  },
};
