const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.tr',
    zipcode: '',
  },
};
