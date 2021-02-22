const { transform } = require('../TR/transform');
const { implementation } = require('../TR/extract');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
  implementation,
};
