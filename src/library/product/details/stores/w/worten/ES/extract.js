const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'worten',
    transform: transform,
    domain: 'worten.es',
    zipcode: '',
  },
};
