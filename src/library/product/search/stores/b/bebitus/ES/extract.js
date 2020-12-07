const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    transform,
    domain: 'bebitus.es',
    zipcode: '',
  },
};
