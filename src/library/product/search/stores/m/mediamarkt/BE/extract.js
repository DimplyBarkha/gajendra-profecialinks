const { transform } = require('../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.be',
    zipcode: '',
  },
};
