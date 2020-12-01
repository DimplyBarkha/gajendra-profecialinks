const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    transform,
    domain: 'cabelas.com',
    zipcode: '',
  },
};
