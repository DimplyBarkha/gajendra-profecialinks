const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.at',
    zipcode: '',
  },
};
