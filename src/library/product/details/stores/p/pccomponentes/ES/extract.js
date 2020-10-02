const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'pccomponentes',
    transform: transform,
    domain: 'pccomponentes.com',
    zipcode: '',
  },
};
