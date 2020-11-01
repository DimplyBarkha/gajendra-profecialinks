const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    transform,
    domain: 'douglas.es',
    zipcode: '',
  },
};
