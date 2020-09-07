const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    transform,
    domain: 'fnac.es',
    zipcode: '',
  },
};
