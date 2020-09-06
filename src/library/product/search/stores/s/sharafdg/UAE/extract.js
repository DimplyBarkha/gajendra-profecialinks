const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UAE',
    store: 'sharafdg',
    transform,
    domain: 'sharafdg.com',
    zipcode: '',
  },
};
