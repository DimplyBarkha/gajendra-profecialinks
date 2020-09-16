const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.tr',
    zipcode: '',
  },
};
