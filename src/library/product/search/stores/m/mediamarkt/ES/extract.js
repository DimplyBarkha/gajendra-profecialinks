const { transform } = require('../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
};
