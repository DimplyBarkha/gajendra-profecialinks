const { transform } = require('../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },
};
