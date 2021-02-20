const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SV',
    store: 'snusbolaget',
    transform,
    domain: 'snusbolaget.se',
    zipcode: '',
  },
};
