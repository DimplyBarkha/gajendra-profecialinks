const { transform } = require('../sharedTransform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'shopstyle',
    transform,
    domain: 'shopstyle.co.uk',
    zipcode: '',
  },
};
