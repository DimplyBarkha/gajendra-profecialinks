const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'salonsdirect',
    transform: transform,
    domain: 'salonsdirect.com',
    zipcode: '',
  },
};
