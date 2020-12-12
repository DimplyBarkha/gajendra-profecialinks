const { transform } = require('../shared');

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
