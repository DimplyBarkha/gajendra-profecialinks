const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
};
