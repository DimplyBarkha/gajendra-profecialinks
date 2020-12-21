const { transform } = require('../../../../../search/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    transform: transform,
    domain: 'fwrd.com',
    zipcode: '',
  },
};
