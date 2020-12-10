const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    transform,
    domain: 'douglas.es',
    zipcode: '',
  },
};
