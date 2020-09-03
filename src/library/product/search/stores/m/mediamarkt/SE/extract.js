const { transform } = require('../shared');

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
