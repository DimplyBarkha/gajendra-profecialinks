const { transform } = require('../shared');

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
