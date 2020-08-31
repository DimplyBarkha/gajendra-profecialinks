const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    transform,
    domain: 'emaxme.com',
    zipcode: '',
  },
};
