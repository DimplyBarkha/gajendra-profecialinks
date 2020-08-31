const { transform } = require('../transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.se',
    zipcode: '',
  },
};
