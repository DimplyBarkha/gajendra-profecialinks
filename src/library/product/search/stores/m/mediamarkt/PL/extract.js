const { transform } = require('../shared');

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
