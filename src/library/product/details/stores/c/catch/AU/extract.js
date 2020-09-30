const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'catch',
    transform,
    domain: 'catch.com.au',
    zipcode: '',
  },
};
