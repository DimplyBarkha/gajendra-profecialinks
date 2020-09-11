const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    transform,
    zipcode: '',
    domain: 'fust.ch',
  },
};
