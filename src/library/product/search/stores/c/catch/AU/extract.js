const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'catch',
    transform: transform,
    domain: 'catch.com.au',
    zipcode: '',
  },
};
