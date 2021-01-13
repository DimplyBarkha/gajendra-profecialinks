const { transform } = require('../sharedTransform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'shopstyle',
    transform,
    zipcode: '',
    domain: 'shopstyle.com',
  },
};
