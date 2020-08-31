const { transform } = require('../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
};
