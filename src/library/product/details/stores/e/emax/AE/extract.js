const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    transform,
    domain: 'emaxme.com',
    zipcode: '',
  },
};
