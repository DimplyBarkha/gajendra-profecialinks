const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsCategory',
    transform,
    domain: 'amazon.es',
    zipcode: '',
  },
};
