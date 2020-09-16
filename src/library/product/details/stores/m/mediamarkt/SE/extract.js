const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.se',
    zipcode: '',
  },
};
